/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { ReloadDocumentListAction } from '@alfresco/aca-shared/store';

@Injectable({
    providedIn: 'root',
})
export class ReloadDocumentListService {
    refreshDocumentList = new Subject<any>();

    constructor(private store: Store<any>) {
        this.refreshDocumentList.subscribe(() => this.emitReloadEffect());
    }

    emitReloadEffect() {
        this.store.dispatch(new ReloadDocumentListAction());
    }
}
