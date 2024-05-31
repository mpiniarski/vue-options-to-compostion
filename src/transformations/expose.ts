import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';

export default (path: NodePath<t.ObjectProperty | t.ObjectMethod>): string => {
    const value = path.get('value') as NodePath<t.Expression>;
    return `const expose = defineExpose(${generate(value.node).code});`;
};
