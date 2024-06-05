import { given, thenExpect, whenScriptIsTransformed } from './_testUtils';

describe('transformComponent - Created Transformations', () => {
    it('transforms created lifecycle hook', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                created() {
                    console.log('Component created');
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            console.log('Component created');
            </script>
        `);
    });
});
