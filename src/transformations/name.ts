import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

export default (path: NodePath<t.ObjectProperty>): string => {
    if (t.isStringLiteral(path.node.value)) {
        const value = path.node.value.value;
        return `defineComponent({ name: '${value}' });`;
    }
    throw new Error('Unsupported value for name property');
};
