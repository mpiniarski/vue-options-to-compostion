import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';

// Define the ComponentOption type
type ComponentOption = {
    name: string;
    transform: (value: t.ObjectExpression) => string;
};

// Implement specific transformations
const componentOptions: ComponentOption[] = [
    {
        name: 'props',
        transform: (value: t.ObjectExpression) => `const props = defineProps(${generate(value).code});`
    },
    {
        name: 'computed',
        transform: (value: t.ObjectExpression) => {
            return value.properties.map(prop => {
                if (t.isObjectMethod(prop)) {
                    const computedName = (prop.key as t.Identifier).name;
                    const computedBody = prop.body;
                    return `const ${computedName} = computed(() => ${generate(computedBody).code});`;
                }
                return '';
            }).join('\n');
        }
    },
    {
        name: 'methods',
        transform: (value: t.ObjectExpression) => {
            return value.properties.map(prop => {
                if (t.isObjectMethod(prop)) {
                    const methodName = (prop.key as t.Identifier).name;
                    const methodBody = prop.body;
                    return `function ${methodName}() ${generate(methodBody).code}`;
                }
                return '';
            }).join('\n');
        }
    },
    {
        name: 'watch',
        transform: (value: t.ObjectExpression) => {
            return value.properties.map(prop => {
                if (t.isObjectMethod(prop)) {
                    const watchName = (prop.key as t.Identifier).name;
                    const watchHandler = prop.body;
                    return `watch(() => ${watchName}, () => ${generate(watchHandler).code});`;
                }
                return '';
            }).join('\n');
        }
    }
];

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
                    objectArg.properties.forEach((property) => {
                        if (t.isObjectProperty(property)) {
                            const key = property.key as t.Identifier;
                            const name = key.name;
                            const value = property.value;

                            const option = componentOptions.find(opt => opt.name === name);
                            if (option && t.isObjectExpression(value)) {
                                scriptSetupLines.push(option.transform(value));
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
    const scriptSetup = `<script setup>\n${scriptSetupLines.join('\n')}\n</script>`;

    return scriptSetup;
}
