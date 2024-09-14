/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import {
    UserPreferenceValues,
    UserPreferencesService,
    DataCellEvent,
    DataColumnComponent,
    DataColumnListComponent,
    PaginationComponent,
    FullNamePipe
} from '@alfresco/adf-core';
import { Pagination } from '@alfresco/js-api';
import { ProcessServiceExtensionState } from '../../../../store/reducers/process-services.reducer';
import { Subject } from 'rxjs';
import { ALL_APPS } from '../../../../models/process-service.model';
import { TaskDetailsExtActions } from '../../../../store/task-details-ext-actions-types';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from '@alfresco/adf-process-services';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'aps-process-details-ext',
    standalone: true,
    imports: [CommonModule, TaskListComponent, DataColumnComponent, DataColumnListComponent, PaginationComponent, FullNamePipe, TranslateModule],
    templateUrl: './process-details-ext.component.html',
    styleUrls: ['./process-details-ext.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        class: 'adf-content-area'
    }
})
export class ProcessDetailsExtComponent implements OnInit {
    @Input()
    processId: string;
    @Input()
    allowNavigateToTask = true;

    presetColumn = 'aps-process-task-list';
    paginationPageSize = 10;
    supportedPageSizes: any[];

    private performAction$ = new Subject<any>();

    constructor(private userPreferenceService: UserPreferencesService, private store: Store<ProcessServiceExtensionState>) {}

    ngOnInit(): void {
        this.fetchPaginationPreference();
        if (this.allowNavigateToTask) {
            this.performContextActions();
        }
    }

    private fetchPaginationPreference() {
        if (this.userPreferenceService.get(UserPreferenceValues.PaginationSize)) {
            this.paginationPageSize = +this.userPreferenceService.get(UserPreferenceValues.PaginationSize);
        } else {
            this.userPreferenceService.select(UserPreferenceValues.PaginationSize).subscribe((pageSize) => {
                this.paginationPageSize = pageSize;
            });
        }
        this.userPreferenceService.select(UserPreferenceValues.SupportedPageSizes).subscribe((supportedPageSizes) => {
            if (typeof supportedPageSizes === 'string') {
                supportedPageSizes = JSON.parse(supportedPageSizes);
            }
            this.supportedPageSizes = supportedPageSizes;
        });
    }

    onChangePageSize(event: Pagination): void {
        this.userPreferenceService.paginationSize = event.maxItems;
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
            this.store.dispatch(
                TaskDetailsExtActions.navigateToTaskDetails({
                    appId: ALL_APPS,
                    selectedTask: action.data
                })
            );
        });
    }

    onRowClick(event: Event) {
        if (this.allowNavigateToTask) {
            const selectedTask = (event as CustomEvent).detail.value.obj;
            this.store.dispatch(
                TaskDetailsExtActions.navigateToTaskDetails({
                    appId: ALL_APPS,
                    selectedTask
                })
            );
        }
    }
}
