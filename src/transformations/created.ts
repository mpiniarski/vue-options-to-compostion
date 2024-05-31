import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';

export default (path: NodePath<t.ObjectProperty | t.ObjectMethod>): string => {
    if (t.isObjectMethod(path.node)) {
        const methodBody = path.node.body;

        if (methodBody) {
            // Generate code from the body of the function without the enclosing braces
            const generatedCode = generate(methodBody).code;
            return generatedCode.slice(1, -1); // Remove the enclosing braces
        } else {
            return '';
        }
    } else if (t.isObjectProperty(path.node) && t.isFunctionExpression(path.node.value)) {
        const methodBody = path.node.value.body;

        if (methodBody) {
            // Generate code from the body of the function without the enclosing braces
            const generatedCode = generate(methodBody).code;
            return generatedCode.slice(1, -1); // Remove the enclosing braces
        } else {
            return '';
        }
    } else {
        return '';
    }
};
