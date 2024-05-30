import { given, thenExpect, whenScriptIsTransformed } from './_testUtils';

describe('transformComponent - Components Transformation', () => {
    it('removes components option', () => {
        const optionsAPIScript = given(`
            import { defineComponent } from 'vue';

            export default defineComponent({
                components: {
                    MyComponent
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            </script>
        `);
    });
});
