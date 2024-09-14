/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Column, DataTableBuilder, DataTableItem } from '@alfresco/adf-testing';
import { browser, protractor } from 'protractor';
import { NameCustomColumn } from '../custom-columns/name-custom-column';

export class SharedFilesPage {
    columnNames = {
        name: 'Name',
        location: 'Location',
        size: 'Size',
        modified: 'Modified',
        modifiedBy: 'Modified by',
        sharedBy: 'Shared by',
    };

    defaultColumns = [
        { columnName: this.columnNames.location, columnType: 'text' } as Column,
        { columnName: this.columnNames.size, columnType: 'text' } as Column,
        { columnName: this.columnNames.modified, columnType: 'date' } as Column,
        {
            columnName: this.columnNames.modifiedBy,
            columnType: 'text',
        } as Column,
        { columnName: this.columnNames.sharedBy, columnType: 'text' } as Column,
        new NameCustomColumn(this.columnNames.name),
    ];

    datatable: DataTableItem = new DataTableBuilder().createDataTable(this.defaultColumns);

    async checkRowIsSelected(contentName: string): Promise<void> {
        await this.datatable.checkRowIsSelected(this.columnNames.name, contentName);
    }

    async selectRowsWithKeyboard(...contentNames: string[]): Promise<void> {
        await browser.actions().sendKeys(protractor.Key.COMMAND).perform();
        for (const name of contentNames) {
            await this.datatable.selectRow(this.columnNames.name, name);
            await this.checkRowIsSelected(name);
        }
        await browser.actions().sendKeys(protractor.Key.NULL).perform();
    }
}
