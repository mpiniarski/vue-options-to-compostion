import {transformComponent} from '../transformComponent';

export function given(script: string) {
    return script;
}

export function whenScriptIsTransformed(script: string) {
    return normalizeScript(transformComponent(script));
}


function normalizeScript(script: string): string {
    return script
    .trim()
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '')
    .join('\n');
}

export const thenExpect = expect;


expect.extend({
    toEqualScript(received: string, expected: string) {
        const message = `Expected: ${this.utils.printExpected(expected)}\nReceived: ${this.utils.printReceived(received,)}`;

        if (normalizeScript(received) === normalizeScript(expected)) {
            return {
                message: () => message,
                pass: true,
            };
        }
        return {
            message: () =>
                    `${message}\n\n${this.utils.diff(expected, received)}`,
            pass: false,
        };
    },
});

interface CustomMatchers<R = unknown> {
    toEqualScript(script: string): R;
}

declare global {
    namespace jest {
        interface Expect extends CustomMatchers {}
        interface Matchers<R> extends CustomMatchers<R> {}
        interface InverseAsymmetricMatchers extends CustomMatchers {}
    }
}
