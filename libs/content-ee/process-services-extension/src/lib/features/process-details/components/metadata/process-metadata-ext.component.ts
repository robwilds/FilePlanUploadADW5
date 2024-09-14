/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Component, Input, HostBinding, ViewEncapsulation } from '@angular/core';
import { ProcessInstanceRepresentation } from '@alfresco/js-api';
import { CommonModule } from '@angular/common';
import { InfoDrawerComponent, InfoDrawerTabComponent } from '@alfresco/adf-core';
import { ProcessInstanceHeaderComponent } from '@alfresco/adf-process-services';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'aps-process-metadata-ext',
    standalone: true,
    imports: [CommonModule, InfoDrawerComponent, InfoDrawerTabComponent, ProcessInstanceHeaderComponent, TranslateModule],
    templateUrl: './process-metadata-ext.component.html',
    styleUrls: ['./process-metadata-ext.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProcessMetadataExtComponent {
    @HostBinding('class.aps-process-metadata') true;

    @Input()
    processInstanceDetails: ProcessInstanceRepresentation;
}
