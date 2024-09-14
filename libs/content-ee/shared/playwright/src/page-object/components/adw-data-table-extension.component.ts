/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { DataTableComponent, MatSelectComponent } from '@alfresco-dbp/shared-playwright';
import { Locator, Page } from '@playwright/test';

export class AdwDataTableExtensionComponent extends DataTableComponent {

    private static childRootElement = 'adw-data-table-extension';

    constructor(page: Page) {
        super(page, AdwDataTableExtensionComponent.childRootElement);
    }

    public contextMenu = new MatSelectComponent(this.page);
    public getRoleExpandMenuLocatorFor = (name: string): Locator => this.getChild(`adw-role-selector[data-automation-id*="${name}"]`);
}
