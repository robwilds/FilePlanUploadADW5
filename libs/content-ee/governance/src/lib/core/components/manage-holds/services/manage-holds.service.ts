/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Injectable } from '@angular/core';
import { combineLatest, forkJoin, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { LegalHoldService, NodesApiService } from '@alfresco/adf-content-services';
import {
    BulkAssignHoldResponseEntry,
    ContentPagingQuery,
    Hold,
    HoldBody,
    HoldBulkStatusEntry,
    HoldEntry,
    NodeAssignedHold,
    NodesIncludeQuery,
    SEARCH_LANGUAGE
} from '@alfresco/js-api';
import { OperationMode } from '../../../model/bulk-operation.model';
import { ExistingHoldDataToConfirm } from '../model/existing-hold-data-to-confirm.model';
import { HoldItem } from '../model/hold-item';

@Injectable({
    providedIn: 'root'
})
export class ManageHoldsService {
    assignedHolds: HoldItem[] = [];
    holdIdForBulkStatus: string;

    constructor(private nodesApiService: NodesApiService, private legalHoldService: LegalHoldService) {}

    getAllHolds(nodeId: string, isFirstLoad: boolean, operationMode: OperationMode, opt?: ContentPagingQuery): Observable<HoldItem[]> {
        return combineLatest([
            this.getHolds('-filePlan-', opt),
            isFirstLoad && operationMode === OperationMode.SINGLE ? this.getAssignedHolds(nodeId) : of(this.assignedHolds)
        ]).pipe(
            map(([holds, assignedHolds]) => {
                const filteredHolds = this.filterHolds(holds, assignedHolds);

                return isFirstLoad ? [...assignedHolds, ...filteredHolds] : filteredHolds;
            })
        );
    }

    getAssignedHolds(
        nodeId: string,
        options?: {
            includeSource?: boolean;
        } & NodesIncludeQuery &
            ContentPagingQuery
    ): Observable<HoldItem[]> {
        return this.nodesApiService.getNodeAssignedHolds(nodeId, options).pipe(
            map(
                (assignedHolds: NodeAssignedHold[]) =>
                    (this.assignedHolds = assignedHolds.map((hold) => ({
                        ...hold,
                        selected: true
                    })))
            )
        );
    }

    getHolds(filePlanId: string, opt?: ContentPagingQuery): Observable<Hold[]> {
        return this.legalHoldService.getHolds(filePlanId, opt);
    }

    saveExistingHolds(data: ExistingHoldDataToConfirm & { nodeId: string }): Observable<string> {
        const assignedIds = this.assignedHolds.map((hold) => hold.id);
        const newHoldIds = data.selectedHoldIds.filter((id) => !assignedIds.includes(id));
        const holdsToUnassign = data.unselectedHoldIds.map((holdId) => this.unassignHold(data.nodeId, holdId));
        const holdsToAssign = newHoldIds.map((holdId) => this.assignHold(holdId, data.nodeId));

        return forkJoin([...holdsToUnassign, ...holdsToAssign]).pipe(
            map(() => 'Save holds success'),
            catchError((error) => throwError(error))
        );
    }

    saveNewHold(holdToCreate: HoldBody, nodeId: string): Observable<HoldEntry> {
        return this.createHold(holdToCreate).pipe(switchMap((hold: HoldEntry) => this.assignHold(hold.entry.id, nodeId)));
    }

    bulkSaveNewHoldToFiles(holdToCreate: HoldBody, query: string): Observable<BulkAssignHoldResponseEntry> {
        return this.createHold(holdToCreate).pipe(
            switchMap((createdHold) => {
                const createdHoldId = createdHold.entry.id;
                this.holdIdForBulkStatus = createdHoldId;
                return this.bulkAssignHold(createdHoldId, query);
            })
        );
    }

    bulkSaveNewHoldToFolder(holdToCreate: HoldBody, folderId: string): Observable<BulkAssignHoldResponseEntry> {
        return this.legalHoldService
            .createHold('-filePlan-', holdToCreate)
            .pipe(switchMap((hold: HoldEntry) => this.bulkAssignHoldToFolder(hold.entry.id, folderId)));
    }

    bulkAssignHold(holdId: string, query: string): Observable<BulkAssignHoldResponseEntry> {
        return this.legalHoldService.bulkAssignHold(holdId, { query, language: SEARCH_LANGUAGE.AFTS });
    }

    private createHold(holdToCreate: HoldBody): Observable<HoldEntry> {
        return this.legalHoldService.createHold('-filePlan-', holdToCreate);
    }

    bulkAssignHoldToFolder(holdId: string, folderId: string): Observable<BulkAssignHoldResponseEntry> {
        return this.legalHoldService.bulkAssignHoldToFolder(holdId, folderId, SEARCH_LANGUAGE.AFTS);
    }

    private assignHold(holdId: string, nodeId: string): Observable<HoldEntry> {
        return this.legalHoldService.assignHold(nodeId, holdId);
    }

    private unassignHold(nodeId: string, holdId: string): Observable<void> {
        return this.legalHoldService.unassignHold(holdId, nodeId);
    }

    private filterHolds(holds: HoldItem[], assignedHolds: HoldItem[]): HoldItem[] {
        return holds.filter((hold) => !assignedHolds.some((assignedHold) => assignedHold.id === hold.id));
    }

    getBulkOperationStatus(bulkStatusId: string): Observable<HoldBulkStatusEntry>{
        return this.legalHoldService.getBulkOperationStatus(bulkStatusId, this.holdIdForBulkStatus);
    }
}
