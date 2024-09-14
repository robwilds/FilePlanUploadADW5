/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Node, NodeEntry } from '@alfresco/js-api';
import { NodesApiService } from '@alfresco/adf-content-services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { IconComponent } from '@alfresco/adf-core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'ooi-resume-active-session',
    standalone: true,
    imports: [CommonModule, IconComponent, TranslateModule],
    templateUrl: './resume-active-session.component.html',
    host: { class: 'adw-microsoft-online-resume-session' },
    encapsulation: ViewEncapsulation.None
})
export class ResumeActiveSessionComponent implements OnInit, OnDestroy {
    @Input()
    data: { node: NodeEntry };
    private onDestroy$ = new Subject<void>();

    constructor(private nodesService: NodesApiService) {}

    get entry(): Node {
        return this.data?.node?.entry;
    }

    ngOnInit(): void {
        this.nodesService.nodeUpdated.pipe(takeUntil(this.onDestroy$)).subscribe((node: Node) => {
            const currentId = this.entry.id;
            const updatedId = node.id;

            if (currentId === updatedId) {
                this.data.node.entry = node;
            }
        });
    }

    get isBeingEditedInMicrosoftOffice(): boolean {
        return (
            this.entry?.aspectNames?.indexOf('ooi:editingInMSOffice') !== -1 &&
            this.entry?.properties?.['ooi:sessionNodeId'] === this.entry?.id &&
            this.entry?.properties?.['ooi:acsSessionOwner'] === this.entry?.properties?.['cm:lockOwner']?.id &&
            localStorage.getItem('microsoftOnline') !== null
        );
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
    }
}
