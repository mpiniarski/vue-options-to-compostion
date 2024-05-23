import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';

export default (path: NodePath<t.ObjectProperty>): string => {
    const value = path.get('value');
    return `const props = defineProps(${generate(value.node).code});`;
};


