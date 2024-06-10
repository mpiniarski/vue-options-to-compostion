import { given, thenExpect, whenScriptIsTransformedToComponent } from './_testUtils';

describe('transformToCompositionAPI - Provide Transformations', () => {
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

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { provide } from 'vue';
            provide('provideKey', 'value');
            </script>
        `);
    });
});
