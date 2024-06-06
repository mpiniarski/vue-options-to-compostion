import {parse} from '@babel/parser';
import traverse, {NodePath} from '@babel/traverse';
import * as t from '@babel/types';
import generate from '@babel/generator';
import {readdirSync} from 'fs';
import {basename, extname, join} from 'path';

// Define the Transformation type
type Transformation = (path: NodePath<t.ObjectProperty | t.ObjectMethod>, context: TransformationContext) => string;

export interface TransformationContext {
    refIdentifiers: Set<string>;
    usedHelpers: Set<string>;
    propIdentifiers: Set<string>;
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
            const {default: transform} = require(join(transformationsDir, file));
            options[fileName] = transform;
        }
    });

    return options;
})();

export function transformComponent(scriptContent: string): string {
    const ast = parse(scriptContent, {sourceType: 'module', plugins: ['jsx']});

    const scriptSetupLines: string[] = [];
    const refIdentifiers = new Set<string>();
    const usedHelpers = new Set<string>();
    const propIdentifiers = new Set<string>();
    const importStatements: string[] = [];
    const refDeclarations: string[] = [];
    let hasElReference = false;

    const context: TransformationContext = {refIdentifiers, usedHelpers, propIdentifiers};

    traverse(ast, {
        ImportDeclaration(path) {
            importStatements.push(generate(path.node).code);
        },
        ExportDefaultDeclaration(path) {
            const declaration = path.node.declaration;

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

    const scriptSetupCode = scriptSetupLines.join('\n');
    const setupAst = parse(scriptSetupCode, {sourceType: 'module', plugins: ['jsx']});
    traverse(setupAst, {
        Identifier(path) {
            if (
                    context.refIdentifiers.has(path.node.name) &&
                    !t.isMemberExpression(path.parent) &&
                    !(path.parentPath.isVariableDeclarator() && path.parentPath.get('id') === path)
            ) {
                path.replaceWith(t.memberExpression(t.identifier(path.node.name), t.identifier('value')));
            }
            if (
                    context.propIdentifiers.has(path.node.name) &&
                    !path.parentPath.isObjectProperty() &&
                    !t.isMemberExpression(path.parent)
            ) {
                path.replaceWith(t.memberExpression(t.identifier('props'), t.identifier(path.node.name)));
            }
            if (path.node.name === '$el') {
                hasElReference = true;
                path.replaceWith(
                        t.memberExpression(
                                t.identifier('root'),
                                t.identifier('value')
                        )
                );
            }
        },
        MemberExpression(memberPath) {
            if (
                    t.isIdentifier(memberPath.node.object, {name: '$refs'}) &&
                    t.isIdentifier(memberPath.node.property)
            ) {
                const refName = memberPath.node.property.name;
                refDeclarations.push(`const ${refName} = ref<HTMLElement>();`);
                memberPath.replaceWith(
                        t.memberExpression(
                                t.identifier(refName),
                                t.identifier('value')
                        )
                );
            }
        }
    });

    if (hasElReference) {
        refDeclarations.unshift('// TODO: add this ref to root element in the template', 'const root = ref<HTMLElement>();');
    }

    const importStatementsVue = usedHelpers.size ? [`import { ${[...usedHelpers].join(', ')} } from 'vue';`] : [];

    const scriptSetup = `<script setup>
${[...importStatements, ...importStatementsVue].join('\n')}
${refDeclarations.join('\n')}
${generate(setupAst).code}
</script>`;

    return scriptSetup;
}
