import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { transformFunctionBody } from './utils/transformFunction';
import generate from "@babel/generator";

export default (path: NodePath<t.ObjectProperty | t.ObjectMethod>): string => {
    const functionBody = transformFunctionBody(path);
    if (t.isBlockStatement(functionBody)) {
        const returnStatementIndex = functionBody.body.findIndex(p => t.isReturnStatement(p));
        if (returnStatementIndex !== -1) {
            functionBody.body.splice(returnStatementIndex, 1); // Remove the return statement
        }
    }
    return `${generate(functionBody).code}`.slice(1, -1); // Remove the enclosing braces
};
