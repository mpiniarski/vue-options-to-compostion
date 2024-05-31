import {NodePath} from '@babel/traverse';
import * as t from '@babel/types';
import {transformFunctionBody} from './utils/transformFunction';
import generate from "@babel/generator";

export default (path: NodePath<t.ObjectProperty | t.ObjectMethod>): string => {
    const functionBody = transformFunctionBody(path);
    return generate(functionBody).code
    // Remove the enclosing braces
    .slice(1, -1);
};
