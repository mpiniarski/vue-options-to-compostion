import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { transformFunctionBody, generateFunctionCall } from './utils/transformFunction';
import {TransformationContext} from "../transformComponent";

export default (path: NodePath<t.ObjectProperty | t.ObjectMethod>, context: TransformationContext): string => {
    const functionBody = transformFunctionBody(path);
    context.usedHelpers.add('onBeforeUnmount');
    return generateFunctionCall('onBeforeUnmount', functionBody);
};
