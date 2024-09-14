/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { NgModule } from '@angular/core';
import { ExtensionService } from '@alfresco/adf-extensions';
import { ProcessDetailsExtComponent } from './components/process-details/process-details-ext.component';
import { ProcessMetadataExtComponent } from './components/metadata/process-metadata-ext.component';
import { EffectsModule } from '@ngrx/effects';
import { ProcessDetailsExtEffect } from './effects/process-details-ext.effect';
import { ProcessDetailsPageExtComponent } from './components/process-details-page-ext.component';

@NgModule({
    imports: [
        EffectsModule.forFeature([ProcessDetailsExtEffect]),
        ProcessDetailsExtComponent,
        ProcessDetailsPageExtComponent,
        ProcessMetadataExtComponent
    ],
    exports: [ProcessDetailsExtComponent]
})
export class ProcessDetailsModule {
    constructor(extensions: ExtensionService) {
        extensions.setComponents({
            'process-services-plugin.components.process-details-ext': ProcessDetailsPageExtComponent
        });
    }
}
