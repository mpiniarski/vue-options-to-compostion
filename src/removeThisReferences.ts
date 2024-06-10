import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

export function removeThisReferences(path: NodePath) {
    path.traverse({
        ThisExpression(thisPath) {
            const parentPath = thisPath.parentPath;
            if (parentPath && (parentPath.isMemberExpression() || parentPath.isOptionalMemberExpression())) {
                const memberExpression = parentPath.node as t.MemberExpression;
                if (t.isIdentifier(memberExpression.property)) {
                    thisPath.parentPath.replaceWith(memberExpression.property);
                }
            }
        }
    });
}
