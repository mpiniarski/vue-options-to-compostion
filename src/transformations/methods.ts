import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { removeThisReferences } from '../removeThisReferences';
import { TransformationContext } from '../transformToCompositionAPI';

export default (path: NodePath<t.ObjectProperty | t.ObjectMethod>, context: TransformationContext): string => {
    const properties = (path.get('value') as NodePath<t.ObjectExpression>).get('properties');
    return properties.map(prop => {
        if (prop.isObjectMethod()) {
            const methodName = (prop.node.key as t.Identifier).name;
            const isAsync = prop.node.async;
            removeThisReferences(prop.get('body') as NodePath<t.BlockStatement>);
            const methodBody = prop.node.body;
            const params = prop.node.params.map(param => generate(param).code).join(', ');
            context.functionIdentifiers.add(methodName); // Add function identifier to context
            return `${isAsync ? 'async ' : ''}function ${methodName}(${params}) ${generate(methodBody).code}`;
        }
        return '';
    }).join('\n');
};
