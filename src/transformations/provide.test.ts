import { given, thenExpect, whenScriptIsTransformed } from './_testUtils';

describe('transformComponent - Provide Transformations', () => {
    it('transforms provide property', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                provide() {
                    return {
                        provideKey: 'value'
                    };
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            provide('provideKey', 'value');
            </script>
        `);
    });
});
