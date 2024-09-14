/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { loadSelectedProcess } from '../../../store/actions/process-details-ext.actions';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { getSelectedProcess } from '../../../process-services-ext.selector';
import { Subject } from 'rxjs';
import { ProcessDetailsExtActions } from '../../../process-details-ext-actions-types';
import { ProcessInstanceRepresentation } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { PageLayoutComponent, PageLayoutContentComponent, PageLayoutHeaderComponent } from '@alfresco/aca-shared';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { ToolbarDividerComponent } from '@alfresco/adf-core';
import { MatButtonModule } from '@angular/material/button';
import { ProcessDetailsExtComponent } from './process-details/process-details-ext.component';
import { ProcessMetadataExtComponent } from './metadata/process-metadata-ext.component';

@Component({
    selector: 'aps-process-details-page-ext',
    standalone: true,
    imports: [
        CommonModule,
        PageLayoutHeaderComponent,
        PageLayoutComponent,
        PageLayoutContentComponent,
        TranslateModule,
        MatIconModule,
        ToolbarDividerComponent,
        MatButtonModule,
        ProcessDetailsExtComponent,
        ProcessMetadataExtComponent
    ],
    templateUrl: './process-details-page-ext.component.html',
    styleUrls: ['./process-details-page-ext.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProcessDetailsPageExtComponent implements OnInit, OnDestroy {
    processInstanceDetails: ProcessInstanceRepresentation = {};
    showMetadata = false;

    private onDestroy$ = new Subject<void>();

    constructor(private route: ActivatedRoute, private store: Store) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.loadProcessDetails(params['processId']);
        });

        this.store
            .select(getSelectedProcess)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((processInstanceDetails) => {
                this.processInstanceDetails = processInstanceDetails;
            });
    }

    private loadProcessDetails(processInstanceId: string) {
        this.store.dispatch(
            loadSelectedProcess({
                processInstanceId
            })
        );
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
        this.store.dispatch(ProcessDetailsExtActions.resetSelectedProcess());
    }
}
