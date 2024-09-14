/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import {inject, Injectable} from '@angular/core';
import { AlfrescoApiService, AuthenticationService } from '@alfresco/adf-core';
import { DiscoveryApiService } from '@alfresco/adf-content-services';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError, filter, tap, switchMap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { ProcessServicesExtActions } from '../process-services-ext-actions-types';

@Injectable({
    providedIn: 'root',
})
export class ProcessExtensionService {
    private store = inject(Store);
    private apiService = inject(AlfrescoApiService);
    private discoveryApiService = inject(DiscoveryApiService);
    private authenticationService = inject(AuthenticationService);

    private _processServicesRunning = false;
    get processServicesRunning(): boolean {
        return this._processServicesRunning;
    }

    checkBackendHealth(): Observable<boolean> {
        return this.apiService.alfrescoApiInitialized.pipe(
            filter((status) => status),
            filter(() => this.authenticationService.isLoggedIn()),
            take(1),
            switchMap(() => this.discoveryApiService.getBPMSystemProperties()),
            map((response) => !!response),
            tap((health) => {
                this._processServicesRunning = health;
                this.store.dispatch(
                    ProcessServicesExtActions.serviceRunningAction({
                        running: health,
                    })
                );
            }),
            catchError(() => {
                this._processServicesRunning = false;
                return of(false);
            })
        );
    }
}
