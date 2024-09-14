/*
 * Copyright © 2005-2024 Hyland Software, Inc. and its affiliates. All rights reserved.
 *
 * License rights for this program may be obtained from Hyland Software, Inc.
 * pursuant to a written agreement and any use of this program without such an
 * agreement is prohibited.
 */

import { RuleContext } from '@alfresco/adf-extensions';
import { Node, NodeEntry } from '@alfresco/js-api';
import { isNodeHavingProp, isLocked } from '../../core/rules/node.evaluator';
import { isLibraryAction, isRMSite } from '../../core/rules/site.evaluator';
import { DeclareRecord } from '../models/declare-record.model';
import { isPendingRestore, isStoredInGlacier } from '../../glacier/rules/glacier-evaluator';
import {
    canDeleteSelection,
    canToggleSharedLink,
    isShared,
    canUploadVersion,
    canToggleEditOffline,
    canOpenWithOffice,
    AcaRuleContext
} from '@alfresco/aca-shared/rules';

export function isNodeRecord(context: RuleContext, node?: NodeEntry): boolean {
    const selectedNode = node ?? context.selection.first;
    return (
        selectedNode &&
        selectedNode.entry.isFile &&
        selectedNode.entry.aspectNames &&
        (selectedNode.entry.aspectNames.indexOf('rma:record') !== -1 || selectedNode.entry.aspectNames.indexOf('rma:declaredRecord') !== -1)
    );
}

export function canDeclareAsRecord(context: RuleContext): boolean {
    if (isRMSite(context) && isLibraryAction(context) && context.selection.nodes.length) {
        if (context.selection.nodes.length === 1) {
            return canDeclareRecord(context, context.selection.first);
        } else {
            return context.selection.nodes.every((node) => context.permissions.check(node, ['update']));
        }
    }
    return false;
}

export function canDeleteRecord(context: RuleContext): boolean {
    const selectedNode = context.selection.first;
    if (selectedNode && selectedNode.entry && !isNodeRecordRejected(context) && isNodeRecord(context)) {
        return context.permissions.check(selectedNode.entry, ['delete']);
    }
    return false;
}

export function canUpdateRecord(context: RuleContext): boolean {
    const selectedNode = context.selection.first;
    if (selectedNode && selectedNode.entry && !isNodeRecordRejected(context) && isNodeRecord(context)) {
        return context.permissions.check(selectedNode.entry, ['update']);
    }
    return false;
}

export function isNodeRecordRejected(context: RuleContext, node?: NodeEntry): boolean {
    const selectedNode = node ?? context.selection.first;
    return isNodeHavingProp(selectedNode, 'aspectNames', 'rma:recordRejectionDetails', 'array');
}

export function isFailedRecord(node: DeclareRecord): boolean {
    return node && node.status === 'failed';
}

export function canDeclareRecord(context: RuleContext, node: NodeEntry): boolean {
    if (node && node.entry && node.entry.isFile && !isLocked(node) && !isRecord(node)) {
        return context.permissions.check(node, ['update']);
    }
    return false;
}

export function isRecord(node: NodeEntry): boolean {
    return isNodeHavingProp(node, 'aspectNames', 'rma:declaredRecord', 'array') || isNodeHavingProp(node, 'aspectNames', 'rma:record', 'array');
}

export function isRejectedRecord(node: NodeEntry): boolean {
    return isNodeHavingProp(node, 'aspectNames', 'rma:recordRejectionDetails', 'array');
}

export function canUpdateVersion(context: RuleContext): boolean {
    const selectedNode = context.selection.first;
    return !(isRecord(selectedNode) || isStoredInGlacier(selectedNode));
}

export function trimRecordId(node: Node): string {
    return node.name.replace(new RegExp(` \\(${node.properties['rma:identifier']}\\)`, 'g'), '');
}

export function canDeleteStoredNode(context: RuleContext): boolean {
    const selectedNode = context.selection.first;
    if (isRecord(selectedNode)) {
        return false;
    }
    return canDeleteSelection(context) && !isStoredInGlacier(selectedNode) && !isPendingRestore(selectedNode);
}

export function canDeleteStoredRecord(context: RuleContext): boolean {
    const selectedNode = context.selection.first;
    if (isRecord(selectedNode)) {
        return canUpdateRecord(context) && !isStoredInGlacier(selectedNode) && !isPendingRestore(selectedNode);
    }
    return false;
}

export function canShareRecord(context: RuleContext): boolean {
    const selectedNode = context.selection.first;
    if (isRecord(selectedNode)) {
        return false;
    }
    return canToggleSharedLink(context);
}

export function canEditSharedURL(context: RuleContext): boolean {
    const selectedNode = context.selection.first;
    if (isRecord(selectedNode)) {
        return false;
    }
    return isShared(context);
}

export function canUploadRecordVersion(context: RuleContext): boolean {
    return !isNodeRecord(context) && canUploadVersion(context);
}

export function canToggleEditOfflineRecord(context: RuleContext): boolean {
    return !isNodeRecord(context) && canToggleEditOffline(context);
}

export function canOpenRecordWithOffice(context: AcaRuleContext): boolean {
    return !isNodeRecord(context) && canOpenWithOffice(context);
}
