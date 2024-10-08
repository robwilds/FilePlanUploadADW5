/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { NodeEntry } from '@alfresco/js-api';
import { AcaRuleContext, isNotTrashcan, isSharedFiles } from '@alfresco/aca-shared/rules';

export function canShowStartProcessFromContent(context: AcaRuleContext): boolean {
    return (
        isProcessServicePluginEnabled(context) &&
        isNotTrashcan(context) &&
        !hasSelectedFolder(context.selection.nodes) &&
        (hasSelectedFile(context.selection.nodes) || isSharedFiles(context)) &&
        !hasSelectedLink(context.selection.nodes)
    );
}

export function hasSelectedLink(nodes: NodeEntry[]): boolean {
    const links = nodes.filter((node) => node.entry.nodeType === 'app:filelink');
    return links.length > 0;
}

export function hasSelectedFolder(nodes: NodeEntry[]): boolean {
    const folder = nodes.filter((node) => node.entry.isFolder);
    return folder.length > 0;
}

export function hasSelectedFile(nodes: NodeEntry[]): boolean {
    const files = nodes.filter((node) => node.entry.isFile);
    return files.length > 0;
}

export function isProcessServicePluginEnabled(context: AcaRuleContext): boolean {
    const flag = context.appConfig.get<boolean | string>('plugins.processService', false);
    return flag === true || flag === 'true';
}

export function isFile(node: NodeEntry): boolean {
    return !!node?.entry?.isFile;
}

export function canDisplayBadgeAndPanel(context: AcaRuleContext, node: NodeEntry): boolean {
    return isProcessServicePluginEnabled(context) && (isFile(node) || isSharedFiles(context));
}
