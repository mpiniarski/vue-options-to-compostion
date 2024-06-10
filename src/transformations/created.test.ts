import { given, thenExpect, whenScriptIsTransformedToComponent } from './_testUtils';

describe('transformToCompositionAPI - Created Transformations', () => {
    it('transforms created lifecycle hook', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                created() {
                    console.log('Component created');
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            console.log('Component created');
            </script>
        `);
    });
});
