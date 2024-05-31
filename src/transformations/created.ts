import {NodePath} from '@babel/traverse';
import * as t from '@babel/types';
import {transformFunctionBody} from './utils/transformFunction';

export default (path: NodePath<t.ObjectProperty | t.ObjectMethod>): string => {
    return transformFunctionBody(path)
    // Remove the enclosing braces
    .slice(1, -1);
};
