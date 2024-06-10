import { given, thenExpect, whenScriptIsTransformedToComponent } from './_testUtils';

describe('transformToCompositionAPI - Components Transformation', () => {
    it('removes components option', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                components: {
                    MyComponent
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            </script>
        `);
    });
});
