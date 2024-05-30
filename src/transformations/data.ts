import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';

export default (path: NodePath<t.ObjectProperty | t.ObjectMethod>): string => {
    const dataFunction = path.get('value') as NodePath<t.ObjectExpression> | NodePath<t.FunctionExpression> | NodePath<t.ArrowFunctionExpression> | NodePath<t.ObjectMethod>;
    let properties: NodePath<t.ObjectProperty | t.ObjectMethod>[] = [];

    if (dataFunction.isObjectExpression()) {
        properties = dataFunction.get('properties') as NodePath<t.ObjectProperty | t.ObjectMethod>[];
    } else if (dataFunction.isFunctionExpression() || dataFunction.isArrowFunctionExpression() || dataFunction.isObjectMethod()) {
        const body = dataFunction.get('body') as NodePath<t.BlockStatement> | NodePath<t.ObjectExpression>;
        if (body.isBlockStatement()) {
            const returnStatement = body.get('body').find(p => t.isReturnStatement(p.node)) as NodePath<t.ReturnStatement>;
            if (returnStatement && returnStatement.node.argument && t.isObjectExpression(returnStatement.node.argument)) {
                properties = (returnStatement.get('argument') as NodePath<t.ObjectExpression>).get('properties') as NodePath<t.ObjectProperty | t.ObjectMethod>[];
            }
        } else if (body.isObjectExpression()) {
            properties = body.get('properties') as NodePath<t.ObjectProperty | t.ObjectMethod>[];
        }
    }

    return properties.map(prop => {
        if (t.isObjectProperty(prop.node)) {
            const key = prop.node.key as t.Identifier;
            const value = prop.node.value;
            return `const ${key.name} = ref(${generate(value).code});`;
        } else if (t.isObjectMethod(prop.node)) {
            const key = prop.node.key as t.Identifier;
            const methodBody = prop.get('body') as NodePath<t.BlockStatement>;
            return `const ${key.name} = ref(function ${key.name}() ${generate(methodBody.node).code});`;
        } else {
            return `// Unhandled property type: ${generate(prop.node)}`;
        }
    }).join('\n');
};
