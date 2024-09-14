/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Directive, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserPreferencesService } from '@alfresco/adf-core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { SetSelectedNodesAction } from '@alfresco/aca-shared/store';
import { Node } from '@alfresco/js-api';
import { takeUntil } from 'rxjs/operators';
import { DataTableExtensionComponent } from '../components/shared/data-table-extension/data-table-extension.component';
import { DocumentListService } from '@alfresco/adf-content-services';

@Directive({
    standalone: true,
    selector: '[adwDataTable]'
})
export class DataTableDirective implements OnInit, OnDestroy {
    private documentListService = inject(DocumentListService);
    selectedNode: Node;

    onDestroy$ = new Subject<boolean>();

    get sortingPreferenceKey(): string {
        return this.route.snapshot.data['sortingPreferenceKey'];
    }

    constructor(
        private store: Store<any>,
        private containerComponent: DataTableExtensionComponent,
        private preferences: UserPreferencesService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.documentListService.resetSelection$.pipe(takeUntil(this.onDestroy$)).subscribe(() => this.reset());

        if (this.sortingPreferenceKey) {
            const current = this.containerComponent.sorting;

            const key = this.preferences.get(`${this.sortingPreferenceKey}.sorting.key`, current[0]);
            const direction = this.preferences.get(`${this.sortingPreferenceKey}.sorting.direction`, current[1]);
            this.containerComponent.data.setSorting({ key, direction });
        }
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    @HostListener('sorting-changed', ['$event'])
    onSortingChanged(event: CustomEvent) {
        if (this.sortingPreferenceKey) {
            this.preferences.set(`${this.sortingPreferenceKey}.sorting.key`, event.detail.key);
            this.preferences.set(`${this.sortingPreferenceKey}.sorting.direction`, event.detail.direction);
        }
    }

    @HostListener('row-select', ['$event'])
    onNodeSelect(event: CustomEvent) {
        if (!!event.detail && !!event.detail.row.node) {
            this.updateSelection();
            this.selectedNode = event.detail.row.node;
        }
    }

    @HostListener('row-unselect')
    onNodeUnselect() {
        this.updateSelection();
    }

    private updateSelection() {
        const selection = this.containerComponent.dataTable.selection
            .map((selected) => selected['node'])
            .map((node) => {
                node['isLibrary'] = true;
                return node;
            });

        this.store.dispatch(new SetSelectedNodesAction(selection));
    }

    private reset() {
        this.containerComponent.dataTable.resetSelection();
        this.store.dispatch(new SetSelectedNodesAction([]));
    }
}
