#!/bin/bash

set -e

# Create the handleExportDefaultDeclaration function in transformComponent.ts
update_transformComponent() {
  cat <<EOL > ./src/transformComponent.ts
import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import { readdirSync } from 'fs';
import { join, extname, basename } from 'path';

// Define the Transformation type
type Transformation = (path: NodePath<t.ObjectProperty | t.ObjectMethod>, context: TransformationContext) => string;

export interface TransformationContext {
    refIdentifiers: Set<string>;
}

// Initialize componentOptions with transformations loaded from files
const componentOptions: Record<string, Transformation> = (() => {
    const options: Record<string, Transformation> = {};
    const transformationsDir = join(__dirname, 'transformations');
    const files = readdirSync(transformationsDir);

    files.forEach(file => {
        const fileExt = extname(file);
        const fileName = basename(file, fileExt);

        // Check for valid TypeScript files excluding test and helper files
        if (fileExt === '.ts' && !file.endsWith('.test.ts') && !file.startsWith('_')) {
            const { default: transform } = require(join(transformationsDir, file));
            options[fileName] = transform;
        }
    });

    return options;
})();

// Helper function to handle property transformations in defineComponent
export function handleExportDefaultDeclaration(
    path: NodePath<t.ExportDefaultDeclaration>,
    propertyName: string,
    handler: (path: NodePath<t.ObjectProperty | t.ObjectMethod>) => string
) {
    const declaration = path.node.declaration;

    // Check if declaration is a call expression to defineComponent
    if (t.isCallExpression(declaration) && t.isIdentifier(declaration.callee) && declaration.callee.name === 'defineComponent') {
        const objectArg = declaration.arguments[0];

        if (t.isObjectExpression(objectArg)) {
            (objectArg.properties as (t.ObjectProperty | t.ObjectMethod)[]).forEach((property, index) => {
                if (t.isObjectProperty(property) || t.isObjectMethod(property)) {
                    const key = property.key as t.Identifier;
                    const name = key.name as keyof typeof componentOptions;
                    if (name === propertyName) {
                        const propertyPath = path.get(\`declaration.arguments.0.properties.\${index}\`) as NodePath<t.ObjectProperty | t.ObjectMethod>;
                        handler(propertyPath);
                    }
                }
            });
        }
    }
}

// Function to transform a component from Options API to Composition API
export function transformComponent(scriptContent: string): string {
    // Parse the script content using Babel
    const ast = parse(scriptContent, { sourceType: 'module', plugins: ['jsx'] });

    const scriptSetupLines: string[] = [];
    const refIdentifiers = new Set<string>();

    const context: TransformationContext = { refIdentifiers };

    traverse(ast, {
        ExportDefaultDeclaration(path) {
            Object.keys(componentOptions).forEach(propertyName => {
                const option = componentOptions[propertyName];
                if (option) {
                    const result = option(path, context);
                    if (result) {
                        scriptSetupLines.push(result);
                    }
                }
            });
        }
    });

    // Combine the generated script setup lines into one string
    const scriptSetupCode = scriptSetupLines.join('\n');

    // Parse the generated script setup code
    const setupAst = parse(scriptSetupCode, { sourceType: 'module', plugins: ['jsx'] });

    // Traverse the AST to append `.value` to `ref` and `computed` properties
    traverse(setupAst, {
        Identifier(path) {
            if (
                context.refIdentifiers.has(path.node.name) &&
                !t.isMemberExpression(path.parent) &&
                !(path.parentPath.isVariableDeclarator() && path.parentPath.get('id') === path) &&
                !(path.parentPath.isAssignmentExpression() && path.parentPath.get('left') === path)
            ) {
                path.replaceWith(t.memberExpression(t.identifier(path.node.name), t.identifier('value')));
            }
        }
    });
    // Generate the final script setup block
    const scriptSetup = `<script setup>
\${generate(setupAst).code}
</script>`;

    return scriptSetup;
}
EOL
}

# Function to create the mixins test file
create_mixins_test() {
  cat <<EOL > ./src/transformations/mixins.test.ts
import { given, thenExpect, whenScriptIsTransformed } from './_testUtils';

describe('transformComponent - Mixins Transformation', () => {
    it('handles mixins property and leaves it inside defineComponent', () => {
        const optionsAPIScript = given(\`
            import { defineComponent } from 'vue';
            import Mixin1 from './Mixin1';
            import Mixin2 from './Mixin2';

            export default defineComponent({
                mixins: [Mixin1, Mixin2],
                data() {
                    return {
                        message: 'Hello'
                    };
                }
            });
        \`);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(\`
            <script setup>
            import { defineComponent } from 'vue';
            import Mixin1 from './Mixin1';
            import Mixin2 from './Mixin2';

            const message = ref('Hello');

            export default defineComponent({
                mixins: [Mixin1, Mixin2]
            });
            </script>
        \`);
    });
});
EOL
}

# Function to handle mixins property transformation
create_mixins_transformation() {
  cat <<EOL > ./src/transformations/mixins.ts
import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

export default (path: NodePath<t.ObjectProperty | t.ObjectMethod>): string => {
    return ''; // Leave mixins inside defineComponent
};
EOL
}

# Create and update the necessary files
create_mixins_test
create_mixins_transformation
update_transformComponent

echo "Mixins transformation and test files created and transformComponent.ts updated successfully."
