/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { ProcessServiceExtensionState } from '../../store/reducers/process-services.reducer';
import { getTaskFilters, getSelectedFilter } from '../../process-services-ext.selector';
import { ProcessServicesExtActions } from '../../process-services-ext-actions-types';
import { UserProcessInstanceFilterRepresentation, UserTaskFilterRepresentation } from '@alfresco/js-api';
import { NavigationStart, Router } from '@angular/router';
import { filter, take, takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { TaskFiltersExtComponent } from '../tasks';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessFiltersExtComponent } from '../processes';
import { MatMenuModule } from '@angular/material/menu';
import { IconComponent } from '@alfresco/adf-core';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'aps-sidenav-ext',
    standalone: true,
    imports: [
        CommonModule,
        MatExpansionModule,
        TaskFiltersExtComponent,
        TranslateModule,
        ProcessFiltersExtComponent,
        MatMenuModule,
        IconComponent,
        MatButtonModule
    ],
    templateUrl: './sidenav-ext.component.html',
    styleUrls: ['./sidenav-ext.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SidenavExtComponent implements OnInit, OnDestroy {
    @Input()
    data: any;

    private onDestroy$ = new Subject<boolean>();
    initialExpandedState = false;

    currentFilter: UserProcessInstanceFilterRepresentation | UserTaskFilterRepresentation;

    constructor(private store: Store<ProcessServiceExtensionState>, private router: Router, private changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationStart),
                takeUntil(this.onDestroy$)
            )
            .subscribe((navigationStart: NavigationStart) => {
                if (this.isNotProcessServicesUrl(navigationStart.url)) {
                    this.resetProcessManagement();
                }
            });

        this.loadFilters();

        this.store
            .select(getSelectedFilter)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((selectedFilter) => {
                this.currentFilter = selectedFilter;
                this.changeDetectorRef.detectChanges();
            });
    }

    private isNotProcessServicesUrl(url: string): boolean {
        return !url.includes('process') && !url.includes('task');
    }

    toggleProcessManagement(expanded: boolean) {
        this.store.dispatch(
            ProcessServicesExtActions.toggleProcessManagement({
                expanded
            })
        );
        if (expanded && !this.currentFilter) {
            if (this.initialExpandedState) {
                this.navigateToDefaultTaskFilter();
            }
            this.initialExpandedState = true;
        }
    }

    processFilterSelected(selectedFilter: UserProcessInstanceFilterRepresentation) {
        this.dispatchSelectFilterAction(selectedFilter);
    }

    taskFilterSelected(selectedFilter: UserProcessInstanceFilterRepresentation | UserTaskFilterRepresentation) {
        this.dispatchSelectFilterAction(selectedFilter);
    }

    dispatchSelectFilterAction(selectedFilter: UserProcessInstanceFilterRepresentation | UserTaskFilterRepresentation) {
        this.store.dispatch(
            ProcessServicesExtActions.selectFilterAction({
                filter: selectedFilter
            })
        );
    }

    private navigateToDefaultTaskFilter() {
        this.store
            .select(getTaskFilters)
            .pipe(
                filter((filters) => !!filters.length),
                take(1)
            )
            .subscribe((taskFilters) => {
                if (taskFilters) {
                    this.store.dispatch(ProcessServicesExtActions.navigateToDefaultTaskFilter({}));
                }
            });
    }

    private resetProcessManagement() {
        this.toggleProcessManagement(false);
        this.dispatchSelectFilterAction(undefined);
    }

    loadFilters() {
        this.store.dispatch(ProcessServicesExtActions.loadFiltersAction({}));
    }

    ngOnDestroy() {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }
}
