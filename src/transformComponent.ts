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

// Function to transform a component from Options API to Composition API
export function transformComponent(scriptContent: string): string {
    // Parse the script content using Babel
    const ast = parse(scriptContent, { sourceType: 'module', plugins: ['jsx'] });

    const scriptSetupLines: string[] = [];
    const refIdentifiers = new Set<string>();

    const context: TransformationContext = { refIdentifiers };

    traverse(ast, {
        ExportDefaultDeclaration(path) {
            const declaration = path.node.declaration;

            // Check if declaration is a call expression to defineComponent
            if (t.isCallExpression(declaration) && t.isIdentifier(declaration.callee) && declaration.callee.name === 'defineComponent') {
                const objectArg = declaration.arguments[0];

                if (t.isObjectExpression(objectArg)) {
                    (objectArg.properties as (t.ObjectProperty | t.ObjectMethod)[]).forEach((property, index) => {
                        if (t.isObjectProperty(property) || t.isObjectMethod(property)) {
                            const key = property.key as t.Identifier;
                            const name = key.name as keyof typeof componentOptions;

                            const option = componentOptions[name];
                            if (option) {
                                const propertyPath = path.get(`declaration.arguments.0.properties.${index}`) as NodePath<t.ObjectProperty | t.ObjectMethod>;
                                try {
                                    scriptSetupLines.push(option(propertyPath, context));
                                } catch (error) {
                                    if (error instanceof Error) {
                                        console.error(`Error transforming property ${name}:`, error.message);
                                    } else {
                                        console.error(`Error transforming property ${name}:`, error);
                                    }
                                    scriptSetupLines.push(`// Error transforming property: ${name}`);
                                }
                            } else {
                                scriptSetupLines.push(`// Unhandled property: ${name}`);
                            }
                        } else {
                            scriptSetupLines.push('// Unhandled property type');
                        }
                    });
                } else {
                    throw new Error('Argument to defineComponent is not an object');
                }
            } else {
                throw new Error('Export default is not a defineComponent call');
            }
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
                !(path.parentPath.isVariableDeclarator() && path.parentPath.get('id') === path)
            ) {
                path.replaceWith(t.memberExpression(t.identifier(path.node.name), t.identifier('value')));
            }
        }
    });
    // Generate the final script setup block
    const scriptSetup = `<script setup>
${generate(setupAst).code}
</script>`;

    return scriptSetup;
}
