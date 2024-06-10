import {transformToCompositionAPI} from '../transformToCompositionAPI';

export function given(script: string) {
    return script;
}

export function whenScriptIsTransformedToComponent(script: string) {
    return transformToCompositionAPI(script, "component");
}

export function whenScriptIsTransformedToComposable(script: string) {
    return transformToCompositionAPI(script, "composable");
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
        const normalisedReceived = normalizeScript(received);
        const normalisedExpected = normalizeScript(expected);

        const pass = normalisedReceived === normalisedExpected;

        if (pass) {
            return {
                message: () => '',
                pass: true,
            };
        }
        return {
            message: () => this.utils.diff(normalisedExpected, normalisedReceived) ?? '',
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
