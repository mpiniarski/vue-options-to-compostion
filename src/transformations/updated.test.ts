import { given, thenExpect, whenScriptIsTransformed } from './_testUtils';

describe('transformComponent - Updated Transformations', () => {
    it('transforms updated lifecycle hook', () => {
        const optionsAPIScript = given(`
            import { defineComponent } from 'vue';

            export default defineComponent({
                updated() {
                    console.log('Component updated');
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            onUpdated(() => {
                console.log('Component updated');
            });
            </script>
        `);
    });
});
