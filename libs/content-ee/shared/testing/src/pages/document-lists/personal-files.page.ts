/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { BrowserActions, Column, DataTableBuilder, DataTableItem, BreadcrumbPage, DataTableComponentPage } from '@alfresco/adf-testing';
import { browser, element, by, protractor } from 'protractor';
import { RecordNameCustomColumn } from '../custom-columns/record-name-custom-column';
export class PersonalFilesPage {
    columnNames = {
        name: 'Name',
        size: 'Size',
        modified: 'Modified',
        modifiedBy: 'Modified by'
    };

    defaultColumns = [
        { columnName: this.columnNames.size, columnType: 'text' } as Column,
        { columnName: this.columnNames.modified, columnType: 'date' } as Column,
        {
            columnName: this.columnNames.modifiedBy,
            columnType: 'text'
        } as Column,
        new RecordNameCustomColumn(this.columnNames.name)
    ];

    path = 'personal-files';
    breadcrumb = 'APP.BROWSE.PERSONAL.TITLE';

    datatable: DataTableItem = new DataTableBuilder().createDataTable(this.defaultColumns, element(by.css('aca-page-layout adf-upload-drag-area')));
    datatableUtils: DataTableComponentPage = new DataTableComponentPage();
    breadcrumbPage = new BreadcrumbPage();

    async navigateToFolderByUrl(folderId: string): Promise<void> {
        const baseUrl = browser.baseUrl.charAt(browser.baseUrl.length - 1) === '/' ? browser.baseUrl : browser.baseUrl + '/';

        await BrowserActions.getUrl(`${baseUrl}#/${this.path}/${folderId}`);
    }

    async waitForFirstRow(): Promise<void> {
        await this.datatable.waitForFirstRow();
    }

    async clickAndEnterOnRowByName(contentName: string): Promise<void> {
        await this.datatable.clickAndEnterOnRow(this.columnNames.name, contentName);
    }

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
