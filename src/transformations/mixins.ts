import {NodePath} from '@babel/traverse';
import * as t from '@babel/types';
import generate from "@babel/generator";
import {TransformationContext} from "../transformComponent";

export default (path: NodePath<t.ObjectProperty | t.ObjectMethod>, context: TransformationContext): string => {
    const value = generate(path.node).code; // Leave mixins inside defineComponent
    context.usedHelpers.add('defineComponent');
    return `defineComponent({ ${value} });`;
};
