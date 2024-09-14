/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import {
    DataCellEvent,
    ObjectDataTableAdapter,
    DataSorting,
    ToolbarComponent,
    DataColumnListComponent,
    DataColumnComponent,
    PaginationComponent,
    FullNamePipe
} from '@alfresco/adf-core';
import { Pagination, UserProcessInstanceFilterRepresentation } from '@alfresco/js-api';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ProcessListExtService } from '../services/process-list-ext.service';
import {
    AppExtensionService,
    PageLayoutComponent,
    PageLayoutContentComponent,
    PageLayoutHeaderComponent,
    ToolbarActionComponent
} from '@alfresco/aca-shared';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessInstanceListComponent } from '@alfresco/adf-process-services';

@Component({
    selector: 'aps-process-list-ext',
    standalone: true,
    imports: [
        CommonModule,
        PageLayoutHeaderComponent,
        PageLayoutComponent,
        PageLayoutContentComponent,
        MatIconModule,
        TranslateModule,
        ToolbarComponent,
        ToolbarActionComponent,
        ProcessInstanceListComponent,
        DataColumnListComponent,
        DataColumnComponent,
        PaginationComponent,
        FullNamePipe
    ],
    templateUrl: './process-list-ext.component.html',
    styleUrls: ['./process-list-ext.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProcessListExtComponent implements OnInit, OnDestroy {
    static RUNNING_PROCESS_FILTER_NAME = 'Running';
    static RUNNING_SCHEMA = 'running';
    static DEFAULT_SCHEMA = 'default';

    appId = null;
    filterId: number;
    currentFilter: UserProcessInstanceFilterRepresentation;
    paginationPageSize = 10;
    supportedPageSizes: any[];
    dataProcesses: ObjectDataTableAdapter;
    processSchema = ProcessListExtComponent.DEFAULT_SCHEMA;
    actions: Array<ContentActionRef> = [];

    private performAction$ = new Subject<any>();
    private onDestroy$ = new Subject<boolean>();

    constructor(private route: ActivatedRoute, private processListExtService: ProcessListExtService, private extensions: AppExtensionService) {}

    ngOnInit() {
        this.route.params
            .pipe(
                switchMap((params) => {
                    this.appId = +params['appId'];
                    this.filterId = +params['filterId'];
                    return this.processListExtService.getProcessFilterById(this.filterId);
                })
            )
            .subscribe((filter) => {
                this.currentFilter = filter;
                this.processListExtService.selectFilter(filter);
                this.processListExtService.expandProcessManagementSection();

                this.processSchema =
                    this.currentFilter.name === ProcessListExtComponent.RUNNING_PROCESS_FILTER_NAME
                        ? ProcessListExtComponent.RUNNING_SCHEMA
                        : ProcessListExtComponent.DEFAULT_SCHEMA;
            });

        this.fetchPaginationPreference();
        this.setSortOrder();
        this.performContextActions();

        this.extensions
            .getAllowedToolbarActions()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((actions) => {
                this.actions = actions;
            });
    }

    trackByActionId(_: number, action: ContentActionRef) {
        return action.id;
    }

    private fetchPaginationPreference() {
        this.processListExtService
            .fetchPaginationPreference()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((res) => {
                this.paginationPageSize = +res.pageSize;
                this.supportedPageSizes = res.supportedPageSizes;
            });
    }

    onChangePageSize(pagination: Pagination): void {
        this.processListExtService.setPageSize(pagination);
    }

    private setSortOrder(): void {
        this.dataProcesses = new ObjectDataTableAdapter([], []);
        this.dataProcesses.setSorting(new DataSorting('started', 'desc'));
    }

    performContextActions() {
        this.performAction$.subscribe((action: any) => {
            this.processListExtService.navigateToProcessDetails(this.appId, action.data);
        });
    }

    onShowRowContextMenu(event: DataCellEvent) {
        event.value.actions = [
            {
                data: event.value.row['obj'],
                model: {
                    key: 'process-details',
                    icon: 'open_in_new',
                    title: 'PROCESS-EXTENSION.PROCESS_LIST.ACTIONS.PROCESS_DETAILS',
                    visible: true
                },
                subject: this.performAction$
            }
        ];
    }

    onRowClick(event: Event) {
        const processInstance = (event as CustomEvent).detail.value.obj;
        this.processListExtService.navigateToProcessDetails(this.appId, processInstance);
    }

    getProcessStatus(processInstance: any): string {
        const statusPath = 'PROCESS-EXTENSION.STATUS.';
        if (processInstance) {
            return statusPath + (this.isRunning(processInstance) ? 'RUNNING' : 'COMPLETED');
        }
        return statusPath + 'UNKNOWN';
    }

    isRunning(processInstance: any): boolean {
        return processInstance && !processInstance.ended;
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
