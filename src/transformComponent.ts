import { parse } from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import computed from './transformations/computed'
import data from './transformations/data'
import methods from './transformations/methods'
import props from './transformations/props'
import watch from './transformations/watch'

// Cache for transformation functions
// Load the transformation functions
const componentOptions = {
    computed,
    data,
    methods,
    props,
    watch,
} as const;

// Function to transform a component from Options API to Composition API
export function transformComponent(scriptContent: string): string {
    // Parse the script content using Babel
    const ast = parse(scriptContent, { sourceType: 'module', plugins: ['jsx'] });

    const scriptSetupLines: string[] = [];

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
                                    scriptSetupLines.push(option(propertyPath));
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

    // Generate the script setup block
    const scriptSetup = `<script setup>
${scriptSetupLines.join('\n')}
</script>`;

    return scriptSetup;
}
