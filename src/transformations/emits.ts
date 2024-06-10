import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import {TransformationContext} from "../transformToCompositionAPI";

export default (path: NodePath<t.ObjectProperty | t.ObjectMethod>, context: TransformationContext): string => {
    const value = path.get('value') as NodePath<t.Expression>;
    context.usedHelpers.add('defineEmits');
    return `const emit = defineEmits(${generate(value.node).code});`;
};
