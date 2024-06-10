import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { removeThisReferences } from '../removeThisReferences';
import {TransformationContext} from "../transformToCompositionAPI";

export default (path: NodePath<t.ObjectProperty | t.ObjectMethod>, context: TransformationContext): string => {
    const properties = (path.get('value') as NodePath<t.ObjectExpression>).get('properties');

    const results = properties.map(prop => {
        if (t.isObjectMethod(prop.node)) {
            const watchName = (prop.node.key as t.Identifier).name;
            removeThisReferences(prop.get('body') as NodePath<t.BlockStatement>);
            const watchHandler = prop.node.body;
            context.usedHelpers.add('watch');
            return `watch(() => ${watchName}, (newValue, oldValue) => ${generate(watchHandler).code});`;
        } else if (t.isObjectProperty(prop.node) && t.isObjectExpression(prop.node.value)) {
            const objectProperties = (prop.get('value') as NodePath<t.ObjectExpression>).get('properties') as NodePath<t.ObjectProperty>[];

            const handlerProp = objectProperties.find(p => t.isIdentifier(p.node.key) && p.node.key.name === 'handler');
            const immediateProp = objectProperties.find(p => t.isIdentifier(p.node.key) && p.node.key.name === 'immediate');

            if (handlerProp && t.isObjectMethod(handlerProp.node)) {
                const watchName = (prop.node.key as t.Identifier).name;
                const handlerBody = handlerProp.get('body') as NodePath<t.BlockStatement>;
                removeThisReferences(handlerBody);
                const immediate = immediateProp ? `{ immediate: true }` : '';
                context.usedHelpers.add('watch');
                return `watch(() => ${watchName}, (newValue, oldValue) => ${generate(handlerBody.node).code}${immediate ? `, ${immediate}` : ''});`;
            } else if (handlerProp && (t.isFunctionExpression(handlerProp.node.value) || t.isArrowFunctionExpression(handlerProp.node.value))) {
                const watchName = (prop.node.key as t.Identifier).name;
                const handlerBody = handlerProp.get('value.body') as NodePath<t.BlockStatement>;
                removeThisReferences(handlerBody);
                const immediate = immediateProp ? `{ immediate: true }` : '';
                context.usedHelpers.add('watch');
                return `watch(() => ${watchName}, (newValue, oldValue) => ${generate(handlerBody.node).code}${immediate ? `, ${immediate}` : ''});`;
            } else if (handlerProp) {
                console.error(`Handler property found but its value is not a function: ${generate(handlerProp.node)}`);
            } else {
                console.error(`Handler property not found in object properties: ${generate(prop.node)}`);
            }
        }
        return `// Unhandled property type: ${generate(prop.node)}`;
    });

    return results.join('\n');
};
