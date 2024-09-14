/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CardViewUpdateService, InfoDrawerComponent, InfoDrawerTabComponent, UpdateNotification } from '@alfresco/adf-core';
import { ProcessServiceExtensionState } from '../../../store/reducers/process-services.reducer';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { TaskDetailsExtActions } from '../../../store/task-details-ext-actions-types';
import { TaskRepresentation } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { TaskHeaderComponent } from '@alfresco/adf-process-services';

@Component({
    selector: 'aps-task-metadata-ext',
    standalone: true,
    imports: [CommonModule, InfoDrawerComponent, InfoDrawerTabComponent, TaskHeaderComponent],
    templateUrl: './task-metadata-ext.component.html',
    styleUrls: ['./task-metadata-ext.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TaskMetadataExtComponent implements OnInit, OnDestroy {
    @Input()
    taskDetails: TaskRepresentation;

    cardViewUpdateSub: Subscription;

    constructor(private store: Store<ProcessServiceExtensionState>, private cardViewUpdateService: CardViewUpdateService) {}

    ngOnInit(): void {
        this.cardViewUpdate();
    }

    private cardViewUpdate() {
        this.cardViewUpdateSub = this.cardViewUpdateService.itemUpdated$.subscribe(this.updateTaskDetails.bind(this));
    }

    private updateTaskDetails(updatedNotification: UpdateNotification) {
        this.store.dispatch(
            TaskDetailsExtActions.updateTaskDetails({
                taskId: this.taskDetails.id,
                taskDetails: this.taskDetails,
                updatedNotification: updatedNotification
            })
        );
    }

    ngOnDestroy() {
        this.cardViewUpdateSub.unsubscribe();
    }
}
