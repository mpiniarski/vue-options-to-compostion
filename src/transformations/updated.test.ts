import { given, thenExpect, whenScriptIsTransformedToComponent } from './_testUtils';

describe('transformToCompositionAPI - Updated Transformations', () => {
    it('transforms updated lifecycle hook', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                updated() {
                    console.log('Component updated');
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { onUpdated } from 'vue';
            onUpdated(() => {
                console.log('Component updated');
            });
            </script>
        `);
    });
});

    it('transforms async updated lifecycle hook', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                async updated() {
                    await fetchData();
                    console.log('Component updated');
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { onUpdated } from 'vue';
            onUpdated(async () => {
                await fetchData();
                console.log('Component updated');
            });
            </script>
        `);
    });
