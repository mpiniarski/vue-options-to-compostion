import {parse} from '@babel/parser';
import traverse, {NodePath} from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import {removeThisReferences} from './removeThisReferences';

// Define the ComponentOption type
type ComponentOption = {
    name: string;
    transform: (path: NodePath<t.ObjectProperty>) => string;
};

// Implement specific transformations
const componentOptions: ComponentOption[] = [
    {
        name: 'props',
        transform: (path: NodePath<t.ObjectProperty>) => {
            const value = path.get('value') as NodePath<t.ObjectExpression>;
            return `const props = defineProps(${generate(value.node).code});`;
        }
    },
    {
        name: 'computed',
        transform: (path: NodePath<t.ObjectProperty>) => {
            const properties = (path.get('value') as NodePath<t.ObjectExpression>).get('properties');
            return properties.map(prop => {
                if (prop.isObjectMethod()) {
                    const computedName = (prop.node.key as t.Identifier).name;
                    removeThisReferences(prop.get('body') as NodePath<t.BlockStatement>);
                    const computedBody = prop.node.body;
                    return `const ${computedName} = computed(() => ${generate(computedBody).code});`;
                }
                return '';
            }).join('\n');
        }
    },
    {
        name: 'methods',
        transform: (path: NodePath<t.ObjectProperty>) => {
            const properties = (path.get('value') as NodePath<t.ObjectExpression>).get('properties');
            return properties.map(prop => {
                if (prop.isObjectMethod()) {
                    const methodName = (prop.node.key as t.Identifier).name;
                    removeThisReferences(prop.get('body') as NodePath<t.BlockStatement>);
                    const methodBody = prop.node.body;
                    const params = prop.node.params.map(param => generate(param).code).join(', ');
                    return `function ${methodName}(${params}) ${generate(methodBody).code}`;
                }
                return '';
            }).join('\n');
        }
    },
    {
        name: 'watch',
        transform: (path: NodePath<t.ObjectProperty>) => {
            const properties = (path.get('value') as NodePath<t.ObjectExpression>).get('properties');
            return properties.map(prop => {
                if (prop.isObjectMethod()) {
                    const watchName = (prop.node.key as t.Identifier).name;
                    removeThisReferences(prop.get('body') as NodePath<t.BlockStatement>);
                    const watchHandler = prop.node.body;
                    return `watch(() => ${watchName}, (newValue, oldValue) => ${generate(watchHandler).code});`;
                }
                return '';
            }).join('\n');
        }
    }
];

// Function to transform a component from Options API to Composition API
export function transformComponent(scriptContent: string): string {
    // Parse the script content using Babel
    const ast = parse(scriptContent, {sourceType: 'module', plugins: ['jsx']});

    const scriptSetupLines: string[] = [];

    traverse(ast, {
        ExportDefaultDeclaration(path) {
            const declaration = path.node.declaration;

            // Check if declaration is a call expression to defineComponent
            if (t.isCallExpression(declaration) && t.isIdentifier(declaration.callee) && declaration.callee.name === 'defineComponent') {
                const objectArg = declaration.arguments[0];

                if (t.isObjectExpression(objectArg)) {
                    (objectArg.properties as t.ObjectProperty[]).forEach((property, index) => {
                        if (t.isObjectProperty(property)) {
                            const key = property.key as t.Identifier;
                            const name = key.name;

                            const option = componentOptions.find(opt => opt.name === name);
                            if (option) {
                                const propertyPath = path.get(`declaration.arguments.0.properties.${index}`) as NodePath<t.ObjectProperty>;
                                scriptSetupLines.push(option.transform(propertyPath));
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
