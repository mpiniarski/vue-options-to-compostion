import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { removeThisReferences } from '../removeThisReferences';

export default (path: NodePath<t.ObjectProperty>): string => {
    const properties = (path.get('value') as NodePath<t.ObjectExpression>).get('properties');

    return properties.map(prop => {
        if (prop.isObjectMethod()) {
            const watchName = (prop.node.key as t.Identifier).name;
            removeThisReferences(prop.get('body') as NodePath<t.BlockStatement>);
            const watchHandler = prop.node.body;
            return `watch(() => ${watchName}, (newValue, oldValue) => ${generate(watchHandler).code});`;
        } else if (prop.isObjectProperty() && t.isObjectExpression(prop.node.value)) {
            const objectProperties = (prop.get('value') as NodePath<t.ObjectExpression>).get('properties') as NodePath<t.ObjectProperty>[];

            const handlerProp = objectProperties.find(p => t.isIdentifier(p.node.key) && p.node.key.name === 'handler');
            const immediateProp = objectProperties.find(p => t.isIdentifier(p.node.key) && p.node.key.name === 'immediate');

            if (handlerProp && t.isObjectMethod(handlerProp.node)) {
                const watchName = (prop.node.key as t.Identifier).name;
                const handlerBody = handlerProp.get('body') as NodePath<t.BlockStatement>;
                removeThisReferences(handlerBody);
                const immediate = immediateProp ? `{ immediate: true }` : '';
                return `watch(() => ${watchName}, (newValue, oldValue) => ${generate(handlerBody.node).code}${immediate ? `, ${immediate}` : ''});`;
            } else if (handlerProp && t.isObjectProperty(handlerProp.node)) {
                const watchName = (prop.node.key as t.Identifier).name;
                const handlerValue = handlerProp.get('value');
                if (t.isFunctionExpression(handlerValue.node) || t.isArrowFunctionExpression(handlerValue.node)) {
                    const handlerBody = handlerValue.get('body') as NodePath<t.BlockStatement>;
                    removeThisReferences(handlerBody);
                    const immediate = immediateProp ? `{ immediate: true }` : '';
                    return `watch(() => ${watchName}, (newValue, oldValue) => ${generate(handlerBody.node).code}${immediate ? `, ${immediate}` : ''});`;
                } else {
                    console.error(`Handler property is not a function: ${generate(handlerProp.node)}`);
                }
            } else {
                console.error(`Handler property not found or is not a valid function: ${generate(prop.node)}`);
            }
        }
        return '';
    }).join('\n');
};
