import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import {TransformationContext} from "../transformToCompositionAPI";

export default (path: NodePath<t.ObjectProperty>, context: TransformationContext): string => {
    if (t.isStringLiteral(path.node.value)) {
        const value = path.node.value.value;
        context.usedHelpers.add('defineComponent');
        return `defineComponent({ name: '${value}' });`;
    }
    throw new Error('Unsupported value for name property');
};
