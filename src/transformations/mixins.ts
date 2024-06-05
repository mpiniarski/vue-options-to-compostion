import {NodePath} from '@babel/traverse';
import * as t from '@babel/types';
import generate from "@babel/generator";

export default (path: NodePath<t.ObjectProperty | t.ObjectMethod>): string => {
    const value = generate(path.node).code; // Leave mixins inside defineComponent
    return `defineComponent({ ${value} });`;
};
