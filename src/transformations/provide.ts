import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { transformFunctionBody } from './utils/transformFunction';
import {TransformationContext} from "../transformComponent";

export default (path: NodePath<t.ObjectProperty | t.ObjectMethod>, context: TransformationContext): string => {
    const methodBody = transformFunctionBody(path);
    let returnStatement: t.ReturnStatement | null = null;
    if (t.isBlockStatement(methodBody)) {
        returnStatement = methodBody.body.find(p => t.isReturnStatement(p)) as t.ReturnStatement;
    }

    const properties = returnStatement && t.isObjectExpression(returnStatement.argument)
        ? (returnStatement.argument as t.ObjectExpression).properties
        : [];

    if(properties.length) {
        context.usedHelpers.add('provide');
    }
    return properties.map(prop => {
        if (!t.isObjectProperty(prop)) {
            throw new Error('Unsupported provide property type');
        }
        const key = (prop.key as t.Identifier).name;
        const value = generate(prop.value).code;
        return `provide('${key}', ${value});`;
    }).join('\n');
};
