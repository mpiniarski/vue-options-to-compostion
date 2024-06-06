import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import {TransformationContext} from "../transformComponent";

export default (path: NodePath<t.ObjectProperty | t.ObjectMethod>, context: TransformationContext): string => {
    if (t.isObjectProperty(path.node)) {
        const value = path.get('value') as NodePath<t.Expression>;
        context.usedHelpers.add('defineProps');
        return `const props = defineProps(${generate(value.node).code});`;
    }
    return '';
};
