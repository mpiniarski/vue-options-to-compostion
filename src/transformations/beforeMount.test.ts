import { given, thenExpect, whenScriptIsTransformed } from './_testUtils';

describe('transformComponent - BeforeMount Transformations', () => {
    it('transforms beforeMount lifecycle hook', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                beforeMount() {
                    console.log('Component before mount');
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            onBeforeMount(() => {
                console.log('Component before mount');
            });
            </script>
        `);
    });
});
