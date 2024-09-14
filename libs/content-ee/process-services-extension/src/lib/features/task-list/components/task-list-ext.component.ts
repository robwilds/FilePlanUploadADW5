/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
    DataCellEvent,
    DataColumnComponent,
    DataColumnListComponent,
    DataSorting,
    FullNamePipe,
    ObjectDataTableAdapter,
    PaginationComponent,
    ToolbarComponent
} from '@alfresco/adf-core';
import { ActivatedRoute } from '@angular/router';
import { Pagination, UserTaskFilterRepresentation } from '@alfresco/js-api';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { TaskListExtService } from '../services/task-list-ext.service';
import {
    AppExtensionService,
    PageLayoutComponent,
    PageLayoutContentComponent,
    PageLayoutHeaderComponent,
    ToolbarActionComponent
} from '@alfresco/aca-shared';
import { ContentActionRef } from '@alfresco/adf-extensions';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { TaskListComponent } from '@alfresco/adf-process-services';

interface TaskDetails {
    isCompleted(): boolean;
}

@Component({
    selector: 'aps-task-list-ext',
    standalone: true,
    imports: [
        CommonModule,
        PageLayoutComponent,
        PageLayoutHeaderComponent,
        PageLayoutContentComponent,
        TranslateModule,
        MatIconModule,
        ToolbarComponent,
        ToolbarActionComponent,
        TaskListComponent,
        DataColumnListComponent,
        DataColumnComponent,
        PaginationComponent,
        FullNamePipe
    ],
    templateUrl: './task-list-ext.component.html',
    styleUrls: ['./task-list-ext.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TaskListExtComponent implements OnInit, OnDestroy {
    static COMPLETED_TASK_FILTER_NAME = 'Completed Tasks';
    static COMPLETED_SCHEMA = 'completed';
    static DEFAULT_SCHEMA = 'default';

    appId = null;
    filterId: number;
    currentFilter: UserTaskFilterRepresentation;
    paginationPageSize = 10;
    supportedPageSizes: any[];
    dataTasks: ObjectDataTableAdapter;
    actions: Array<ContentActionRef> = [];
    taskSchema: string = TaskListExtComponent.DEFAULT_SCHEMA;

    private performAction$ = new Subject<any>();
    private onDestroy$ = new Subject<boolean>();

    constructor(private taskListExtService: TaskListExtService, private route: ActivatedRoute, private extensions: AppExtensionService) {}

    ngOnInit() {
        this.route.params
            .pipe(
                switchMap((params) => {
                    this.appId = +params['appId'];
                    this.filterId = +params['filterId'];
                    return this.taskListExtService.getTaskFilterById(this.filterId);
                })
            )
            .subscribe((filter) => {
                this.currentFilter = filter;
                this.taskListExtService.selectFilter(filter);
                this.taskListExtService.expandProcessManagementSection();

                this.taskSchema =
                    this.currentFilter.name === TaskListExtComponent.COMPLETED_TASK_FILTER_NAME
                        ? TaskListExtComponent.COMPLETED_SCHEMA
                        : TaskListExtComponent.DEFAULT_SCHEMA;
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
        this.taskListExtService
            .fetchPaginationPreference()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((res) => {
                this.paginationPageSize = +res.pageSize;
                this.supportedPageSizes = res.supportedPageSizes;
            });
    }

    private setSortOrder(): void {
        this.dataTasks = new ObjectDataTableAdapter([], []);
        this.dataTasks.setSorting(new DataSorting('created', 'desc'));
    }

    onChangePageSize(pagination: Pagination): void {
        this.taskListExtService.setPageSize(pagination);
    }

    onShowRowContextMenu(event: DataCellEvent) {
        event.value.actions = [
            {
                data: event.value.row['obj'],
                model: {
                    key: 'task-details',
                    icon: 'open_in_new',
                    title: 'PROCESS-EXTENSION.TASK_LIST.ACTIONS.TASK_DETAILS',
                    visible: true
                },
                subject: this.performAction$
            }
        ];
    }

    performContextActions() {
        this.performAction$.subscribe((action: any) => {
            this.taskListExtService.navigateToTaskDetails(this.appId, action.data);
        });
    }

    onRowClick(event: Event) {
        const selectedTask = (event as CustomEvent).detail.value.obj;
        this.taskListExtService.navigateToTaskDetails(this.appId, selectedTask);
    }

    getTaskStatus(taskDetails: TaskDetails): string {
        return 'PROCESS-EXTENSION.STATUS.' + (taskDetails?.isCompleted?.() ? 'COMPLETED' : 'RUNNING');
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
