import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { removeThisReferences } from '../../removeThisReferences';

export function transformFunctionBody(path: NodePath<t.ObjectProperty | t.ObjectMethod>): t.BlockStatement {
    let functionBody: NodePath<t.BlockStatement>;

    if (path.isObjectMethod()) {
        functionBody = path.get('body') as NodePath<t.BlockStatement>;
    } else if (path.isObjectProperty()) {
        const valuePath = path.get('value');
        if (valuePath.isFunctionExpression() || valuePath.isArrowFunctionExpression()) {
            functionBody = valuePath.get('body') as NodePath<t.BlockStatement>;
        } else {
            throw new Error('Unsupported function type');
        }
    } else {
        throw new Error('Unsupported property type');
    }

    removeThisReferences(functionBody);
    return functionBody.node;
}

export function generateFunctionCall(hook: string, functionBody: t.BlockStatement): string {
    const generatedCode = generate(functionBody).code;
    if (!generatedCode.startsWith('{')) {
        return `${hook}(() => { ${generatedCode} });`;
    }
    return `${hook}(() => ${generatedCode});`;
}
