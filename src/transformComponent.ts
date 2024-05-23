import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import prettier from 'prettier';

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
                if (t.isObjectProperty(prop) && t.isFunctionExpression(prop.value)) {
                    const computedName = (prop.key as t.Identifier).name;
                    const computedBody = prop.value.body;
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
                    return `function ${methodName} ${generate(methodBody).code}`;
                }
                return '';
            }).join('\n');
        }
    },
    {
        name: 'watch',
        transform: (value: t.ObjectExpression) => {
            return value.properties.map(prop => {
                if (t.isObjectProperty(prop) && t.isFunctionExpression(prop.value)) {
                    const watchName = (prop.key as t.StringLiteral).value;
                    const watchHandler = prop.value.body;
                    return `watch(() => ${watchName}, () => ${generate(watchHandler).code});`;
                }
                return '';
            }).join('\n');
        }
    }
];

// Function to transform a component from Options API to Composition API
export async function transformComponent(scriptContent: string): Promise<string> {
    // Parse the script content using Babel
    const ast = parse(scriptContent, { sourceType: 'module', plugins: ['jsx'] });

    const scriptSetupLines: string[] = [];

    traverse(ast, {
        ExportDefaultDeclaration(path) {
            const declaration = path.node.declaration as t.CallExpression;
            const objectArg = declaration.arguments[0] as t.ObjectExpression;

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
        }
    });

    // Generate the script setup block
    const scriptSetup = `<script setup>\n${scriptSetupLines.join('\n')}\n</script>`;

    // Format the generated code using Prettier
    const formattedCode = prettier.format(scriptSetup, { parser: 'vue' });

    return formattedCode;
}
