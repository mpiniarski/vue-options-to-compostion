#!/bin/bash

# Update transformFunction.ts
cat << 'EOF' > ./src/transformations/utils/transformFunction.ts
import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { removeThisReferences } from '../../removeThisReferences';

export function transformFunctionBody(path: NodePath<t.ObjectProperty | t.ObjectMethod>): t.BlockStatement {
    let functionBody: NodePath<t.BlockStatement>;

    if (path.isObjectMethod()) {
        functionBody = path.get('body') as NodePath<t.BlockStatement>;
    } else if (path.isObjectProperty()) {
        const valuePath = path.get('value');
        if (valuePath.isFunctionExpression() || valuePath.isArrowFunctionExpression()) {
            functionBody = valuePath.get('body') as NodePath<t.BlockStatement>;
        } else {
            throw new Error('Unsupported function type');
        }
    } else {
        throw new Error('Unsupported property type');
    }

    removeThisReferences(functionBody);
    return functionBody.node;
}

export function generateFunctionCall(hook: string, functionBody: t.BlockStatement): string {
    const generatedCode = generate(functionBody).code;
    if (!generatedCode.startsWith('{')) {
        return `${hook}(() => { ${generatedCode} });`;
    }
    return `${hook}(() => ${generatedCode});`;
}
EOF

# Function to update lifecycle hook files
update_lifecycle_hook() {
  local hook_name=$1
  local hook_function=$2
  cat << EOF > ./src/transformations/${hook_name}.ts
import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { transformFunctionBody, generateFunctionCall } from './utils/transformFunction';

export default (path: NodePath<t.ObjectProperty | t.ObjectMethod>): string => {
    const functionBody = transformFunctionBody(path);
    return generateFunctionCall('${hook_function}', functionBody);
};
EOF
}

# Update lifecycle hook files
update_lifecycle_hook "beforeCreate" "onBeforeCreate"
update_lifecycle_hook "beforeMount" "onBeforeMount"
update_lifecycle_hook "beforeUnmount" "onBeforeUnmount"
update_lifecycle_hook "beforeUpdate" "onBeforeUpdate"
update_lifecycle_hook "mounted" "onMounted"
update_lifecycle_hook "unmounted" "onUnmounted"
update_lifecycle_hook "updated" "onUpdated"

echo "Lifecycle hooks updated successfully."
