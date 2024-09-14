/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ManageHoldsService } from '../../services/manage-holds.service';
import { takeUntil } from 'rxjs/operators';
import { ManageHoldsDialogService } from '../../services/manage-holds-dialog.service';
import { ManageHoldsListDataSource } from '../../services/manage-holds-datasource';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatCommonModule } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { OperationMode } from '../../../../model/bulk-operation.model';
import { HoldItem } from '../../model/hold-item';

@Component({
    templateUrl: '../existing-holds/existing-holds.component.html',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    host: { class: 'aga-manage-holds-list' },
    imports: [
        ScrollingModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        NgIf,
        AsyncPipe,
        MatListModule,
        MatTooltipModule,
        MatIconModule,
        MatCommonModule,
        TranslateModule
    ]
})
export class ExistingHoldsComponent implements OnInit, OnChanges, OnDestroy {
    @Input() nodeId: string;
    @Input() operationMode: OperationMode;

    @Output() valueChange = new EventEmitter<boolean>();
    @Output() numberOfHoldsLoaded = new EventEmitter<number>();
    @Output() switchTabToApplyHold = new EventEmitter<void>();

    @ViewChild('viewport') viewport: CdkVirtualScrollViewport;

    holdsDataSource: ManageHoldsListDataSource;
    selectedHolds: HoldItem[] = [];
    unselectedHoldIds: string[] = [];

    readonly OperationMode = OperationMode;
    readonly isLoading$ = new BehaviorSubject(true);
    protected readonly onDestroy$ = new Subject<void>();

    constructor(
        private cdr: ChangeDetectorRef,
        protected manageHoldsService: ManageHoldsService,
        protected manageHoldsDialogService: ManageHoldsDialogService
    ) {}

    ngOnInit() {
        this.holdsDataSource = new ManageHoldsListDataSource(this.manageHoldsService, this.nodeId, this.operationMode);

        this.holdsDataSource.isLoading.pipe(takeUntil(this.onDestroy$)).subscribe((isLoading) => {
            this.isLoading$.next(isLoading);
            if (!isLoading) {
                this.numberOfHoldsLoaded.emit(this.holdsDataSource.itemsCount);
            }
            this.cdr.detectChanges();
            this.selectedHolds = this.manageHoldsService.assignedHolds.map((hold) => ({ ...hold }));
        });
    }

    ngOnChanges() {
        if (this.holdsDataSource) {
            this.loadHoldsHistory();
            this.viewport.scrollToIndex(0);
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
        this.manageHoldsService.assignedHolds = [];
    }

    toggleSelection(hold: HoldItem): void {}

    loadHoldsHistory() {
        this.holdsDataSource.reset();
    }

    onSelectionChange() {
        if (this.selectedHolds.length !== this.manageHoldsService.assignedHolds.length) {
            this.valueChange.emit(true);
        } else {
            const hasValueChanged = this.selectedHolds.some(
                (selectedHold) => !this.manageHoldsService.assignedHolds.find((assignedHold) => assignedHold.id === selectedHold.id)
            );

            this.valueChange.emit(hasValueChanged);
        }

        this.manageHoldsDialogService.dataToConfirm$.next({
            selectedHoldIds: this.selectedHolds.map((hold) => hold.id),
            unselectedHoldIds: this.unselectedHoldIds
        });
    }
}
