import {parse} from '@babel/parser';
import traverse, {NodePath} from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import {removeThisReferences} from './removeThisReferences';
import { readdirSync } from 'fs';
import { join } from 'path';

// Define the ComponentOption type
type ComponentOption = {
    name: string;
    transform: (path: NodePath<t.ObjectProperty>) => string;
};

/// Function to dynamically load transformation functions
function loadTransformations(): ComponentOption[] {
    const transformationsDir = join(__dirname, 'transformations');
    const files = readdirSync(transformationsDir);
    return files.map(file => {
        const name = file.replace('.ts', '');
        const { default: transform } = require(join(transformationsDir, file));
        return { name, transform };
    });
}

// Load the transformation functions
const componentOptions = loadTransformations();

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
