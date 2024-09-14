/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NotificationService, UpdateNotification } from '@alfresco/adf-core';
import { TaskListService } from '@alfresco/adf-process-services';
import { switchMap, tap, catchError, take, concatMap } from 'rxjs/operators';
import { loadTaskDetails, updateTaskDetails, reloadTaskDetails } from '../../../store/actions/task-details-ext.actions';
import { TaskDetailsExtActions } from '../../../store/task-details-ext-actions-types';
import { throwError } from 'rxjs';
import { ProcessServiceExtensionState } from '../../../store/reducers/process-services.reducer';
import { Store } from '@ngrx/store';
import { getSelectedTask } from '../../../process-services-ext.selector';
import { TaskRepresentation } from '@alfresco/js-api';

@Injectable()
export class TaskDetailsExtEffect {
    constructor(
        private actions$: Actions,
        private store: Store<ProcessServiceExtensionState>,
        private taskListService: TaskListService,
        private notificationService: NotificationService
    ) {}

    loadTaskDetails$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(loadTaskDetails),
                tap((action) => {
                    this.store
                        .select(getSelectedTask)
                        .pipe(take(1))
                        .subscribe((taskDetails) => {
                            if (!taskDetails || action.taskId !== taskDetails.id) {
                                this.loadTaskDetails(action.taskId);
                            }
                        });
                })
            ),
        { dispatch: false }
    );

    reloadTaskDetails$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(reloadTaskDetails),
                tap((action) => {
                    this.loadTaskDetails(action.taskId);
                })
            ),
        { dispatch: false }
    );

    updateTaskDetails$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(updateTaskDetails),
                concatMap((action) => this.updateTaskDetails(action.taskId, action.taskDetails, action.updatedNotification))
            ),
        { dispatch: true }
    );

    private loadTaskDetails(taskId: string) {
        this.taskListService.getTaskDetails(taskId).subscribe(
            (taskDetails) => {
                this.store.dispatch(TaskDetailsExtActions.setTaskDetails({ taskDetails }));
            },
            (error: any) => {
                this.notificationService.showError('PROCESS-EXTENSION.TASK_DETAILS.FAILED_TO_LOAD');
                return throwError(error);
            }
        );
    }

    private updateTaskDetails(taskId: string, taskDetails: TaskRepresentation, updateNotification: UpdateNotification) {
        return this.taskListService.updateTask(taskId, updateNotification.changed).pipe(
            tap(() => this.notificationService.showInfo('PROCESS-EXTENSION.TASK_DETAILS.UPDATED', null, { property: Object.keys(updateNotification.changed)[0] })),
            switchMap(() => [this.setUpdatedTaskDetails(taskDetails, updateNotification)]),
            catchError((error: any) => {
                this.notificationService.showError('PROCESS-EXTENSION.TASK_DETAILS.FAILED_TO_UPDATE', null, { property: Object.keys(updateNotification.changed)[0] });
                return throwError(error);
            })
        );
    }

    private setUpdatedTaskDetails(taskDetails: TaskRepresentation, updateNotification: UpdateNotification) {
        const updated = { ...taskDetails, ...updateNotification.changed };
        return TaskDetailsExtActions.setTaskDetails({ taskDetails: updated });
    }
}
