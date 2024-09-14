/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { BulkOperationService } from '../../services/bulk-operation.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ReloadDocumentListService } from '../../services/reload-document-list.service';
import { OperationStatus } from '../../model/bulk-operation.model';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IconComponent } from '../icon/icon.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'aga-declare-record-dialog',
    standalone: true,
    imports: [CommonModule, TranslateModule, IconComponent, MatProgressSpinnerModule, MatIconModule, MatListModule, MatButtonModule],
    templateUrl: './bulk-operation-dialog.component.html',
    styleUrls: ['./bulk-operation-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BulkOperationDialogComponent implements OnInit, OnDestroy {
    onDestroy$ = new Subject();
    operationStatus = OperationStatus;

    constructor(
        private dialogRef: MatDialogRef<BulkOperationDialogComponent>,
        public bulkRecordService: BulkOperationService,
        private changeDetectorRef: ChangeDetectorRef,
        private reload: ReloadDocumentListService
    ) {}

    ngOnInit(): void {
        this.bulkRecordService.operationCompleted.pipe(takeUntil(this.onDestroy$)).subscribe(() => this.changeDetectorRef.detectChanges());
        this.bulkRecordService.operationStarted.pipe(takeUntil(this.onDestroy$)).subscribe(() => this.changeDetectorRef.detectChanges());
        this.bulkRecordService.operationCompleted.pipe(debounceTime(200), takeUntil(this.onDestroy$)).subscribe(() => this.reload.emitReloadEffect());
    }

    close() {
        this.dialogRef.close();
    }

    ngOnDestroy(): void {
        this.bulkRecordService.clearQueue();
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
