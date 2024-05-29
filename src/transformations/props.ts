import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';

export default (path: NodePath<t.ObjectProperty | t.ObjectMethod>): string => {
    if (t.isObjectProperty(path.node)) {
        const value = path.get('value') as NodePath<t.Expression>;
        return `const props = defineProps(${generate(value.node).code});`;
    }
    return '';
};
