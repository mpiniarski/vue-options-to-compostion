import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';

export default (path: NodePath<t.ObjectProperty | t.ObjectMethod>): string => {
    const key = (path.node.key as t.Identifier).name;
    const value = path.get('value') as NodePath<t.Expression>;
    return `const emit = defineEmits(${generate(value.node).code});`;
};
