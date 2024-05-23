import {NodePath} from "@babel/traverse";
import * as t from '@babel/types';
import generate from '@babel/generator';
import {removeThisReferences} from "../removeThisReferences";

export default (path: NodePath<t.ObjectProperty>) => {
    const properties = (path.get('value') as NodePath<t.ObjectExpression>).get('properties');
    return properties.map(prop => {
        if (prop.isObjectMethod()) {
            const computedName = (prop.node.key as t.Identifier).name;
            removeThisReferences(prop.get('body') as NodePath<t.BlockStatement>);
            const computedBody = prop.node.body;
            return `const ${computedName} = computed(() => ${generate(computedBody).code});`;
        }
        return '';
    }).join('\n');
};
