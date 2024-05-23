import { parse } from '@babel/parser';
import generate from '@babel/generator';
import traverse, { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { removeThisReferences } from '../src/removeThisReferences';

type TestCase = {
    name: string;
    before: string;
    after: string;
};

const testCases: TestCase[] = [
    {
        name: 'removes this references in function declarations',
        before: `
            function greet() {
                console.log(this.message);
            }
        `,
        after: `
            function greet() {
                console.log(message);
            }
        `
    },
    {
        name: 'removes this references in arrow functions',
        before: `
            const greet = () => {
                console.log(this.message);
            };
        `,
        after: `
            const greet = () => {
                console.log(message);
            };
        `
    },
    {
        name: 'removes this references in object methods',
        before: `
            const obj = {
                greet() {
                    console.log(this.message);
                }
            };
        `,
        after: `
            const obj = {
                greet() {
                    console.log(message);
                }
            };
        `
    },
    {
        name: 'removes this references in class methods',
        before: `
            class Greeter {
                greet() {
                    console.log(this.message);
                }
            }
        `,
        after: `
            class Greeter {
                greet() {
                    console.log(message);
                }
            }
        `
    },
    {
        name: 'removes this references in nested functions',
        before: `
            function outer() {
                function inner() {
                    console.log(this.message);
                }
                inner();
            }
        `,
        after: `
            function outer() {
                function inner() {
                    console.log(message);
                }
                inner();
            }
        `
    },
    {
        name: 'removes this references when calling a function',
        before: `
            const obj = {
                callFunction() {
                    this.someFunction(this.message);
                },
                someFunction(msg) {
                    console.log(msg);
                }
            };
        `,
        after: `
            const obj = {
                callFunction() {
                    someFunction(message);
                },
                someFunction(msg) {
                    console.log(msg);
                }
            };
        `
    },
    {
        name: 'removes this references when calling a function in a class',
        before: `
            class Greeter {
                callFunction() {
                    this.someFunction(this.message);
                }
                someFunction(msg) {
                    console.log(msg);
                }
            }
        `,
        after: `
            class Greeter {
                callFunction() {
                    someFunction(message);
                }
                someFunction(msg) {
                    console.log(msg);
                }
            }
        `
    },
    {
        name: 'removes this references in a block statement',
        before: `
            {
                function greet() {
                    console.log(this.message);
                }
                greet();
            }
        `,
        after: `
            {
                function greet() {
                    console.log(message);
                }
                greet();
            }
        `
    }
];

function cleanUpScript(script: string): string {
    return script
    .trim()
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '')
    .join('\n');
}

function transformCode(code: string): string {
    const ast = parse(code, { sourceType: 'module', plugins: ['jsx'] });
    traverse(ast, {
        Program(path) {
            removeThisReferences(path);
        }
    });
    return generate(ast).code;
}

describe('removeThisReferences', () => {
    testCases.forEach(({ name, before, after }) => {
        it(name, () => {
            expect(cleanUpScript(transformCode(before))).toBe(cleanUpScript(after));
        });
    });

    it('handles non-top-level BlockStatement', () => {
        const input = `
            function outer() {
                function inner() {
                    console.log(this.message);
                }
                inner();
            }
        `;
        const output = `
            function outer() {
                function inner() {
                    console.log(message);
                }
                inner();
            }
        `;

        const ast = parse(input, { sourceType: 'module', plugins: ['jsx'] });

        // Traverse to find the inner BlockStatement
        traverse(ast, {
            FunctionDeclaration(path) {
                if (path.node.id && path.node.id.name === 'inner') {
                    removeThisReferences(path.get('body'));
                }
            }
        });

        expect(cleanUpScript(generate(ast).code)).toBe(cleanUpScript(output));
    });
});
