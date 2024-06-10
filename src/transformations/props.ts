import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { TransformationContext } from "../transformToCompositionAPI";

export default (path: NodePath<t.ObjectProperty | t.ObjectMethod>, context: TransformationContext, type: 'component' | 'composable'): string => {
    if (t.isObjectProperty(path.node)) {
        const value = path.get('value') as NodePath<t.Expression>;

        // Check if value is an array
        if (t.isArrayExpression(value.node)) {
            value.node.elements.forEach(element => {
                if (t.isStringLiteral(element)) {
                    context.propIdentifiers.add(element.value);
                }
            });
        }
        // Check if value is an object
        else if (t.isObjectExpression(value.node)) {
            value.node.properties.forEach(prop => {
                if (t.isObjectProperty(prop)) {
                    const propKey = prop.key as t.Identifier;
                    context.propIdentifiers.add(propKey.name);
                }
            });
        }


        if (type === 'component') {
            context.usedHelpers.add('defineProps');
            return `const props = defineProps(${generate(value.node).code});`;
        } else if (type === 'composable') {
            context.globalStatements.push(`export const USE_XXX_PROPS = ${generate(value.node).code};`);

            return ''
        }
    }
    return '';
};
