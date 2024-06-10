import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { transformFunctionBody, generateFunctionCall } from './utils/transformFunction';
import {TransformationContext} from "../transformToCompositionAPI";

export default (path: NodePath<t.ObjectProperty | t.ObjectMethod>, context: TransformationContext): string => {
    const functionBody = transformFunctionBody(path);
    context.usedHelpers.add('onBeforeMount');
    return generateFunctionCall('onBeforeMount', functionBody);
};
