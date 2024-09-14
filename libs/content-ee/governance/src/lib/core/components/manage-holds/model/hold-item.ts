/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { Hold } from '@alfresco/js-api';

export interface HoldItem extends Omit<Hold, 'reason'> {
    selected?: boolean;
    reason?: string;
}
