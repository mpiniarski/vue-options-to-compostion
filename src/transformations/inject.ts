import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import {TransformationContext} from "../transformComponent";

export default (path: NodePath<t.ObjectProperty | t.ObjectMethod>, context: TransformationContext): string => {
    const valuePath = path.get('value') as NodePath<t.Expression>;
    if (t.isArrayExpression(valuePath.node)) {
        return valuePath.node.elements.map(element => {
            const key = (element as t.StringLiteral).value;
            context.usedHelpers.add('inject');
            return `const ${key} = inject('${key}');`;
        }).join('\n');
    } else if (t.isObjectExpression(valuePath.node)) {
        return valuePath.node.properties.map(prop => {
            if (!t.isObjectProperty(prop)) {
                throw new Error('Unsupported inject property type');
            }
            const key = (prop.key as t.Identifier).name;
            const fromProp = (prop.value as t.ObjectExpression).properties.find(p => t.isObjectProperty(p) && (p.key as t.Identifier).name === 'from') as t.ObjectProperty;
            const defaultProp = (prop.value as t.ObjectExpression).properties.find(p => t.isObjectProperty(p) && (p.key as t.Identifier).name === 'default') as t.ObjectProperty;
            const from = fromProp ? generate(fromProp.value).code : undefined;
            const defaultValue = defaultProp ? generate(defaultProp.value).code : 'undefined';
            context.usedHelpers.add('inject');
            return `const ${key} = inject(${from}, ${defaultValue});`;
        }).join('\n');
    } else {
        throw new Error('Unsupported inject property format');
    }
};
