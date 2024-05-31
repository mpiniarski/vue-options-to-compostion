import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { transformFunctionBody, generateFunctionCall } from './utils/transformFunction';

export default (path: NodePath<t.ObjectProperty | t.ObjectMethod>): string => {
    const functionBody = transformFunctionBody(path);
    return generateFunctionCall('onUpdated', functionBody);
};
