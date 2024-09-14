/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { DataTableBuilder, DataTableComponentPage, DataTableItem } from '@alfresco/adf-testing';
import { browser, protractor } from 'protractor';
import { SearchResultsCustomColumn } from '../custom-columns/search-results-custom-column';

export class SearchResultsPage {
    defaultColumns = [new SearchResultsCustomColumn('Name')];
    searchResultsColumn = 'Name';

    datatable: DataTableItem = new DataTableBuilder().createDataTable(this.defaultColumns);
    dataTableUtils: DataTableComponentPage = new DataTableComponentPage();

    async checkRowIsSelected(contentName: string): Promise<void> {
        await this.datatable.checkRowIsSelected(this.searchResultsColumn, contentName);
    }

    async selectRowsWithKeyboard(...contentNames: string[]): Promise<void> {
        let option: any;
        await browser.actions().sendKeys(protractor.Key.COMMAND).perform();
        for (const name of contentNames) {
            option = await this.datatable.getRow(this.searchResultsColumn, name);
            await option.click();
            await this.checkRowIsSelected(name);
        }
        await browser.actions().sendKeys(protractor.Key.NULL).perform();
    }
}
