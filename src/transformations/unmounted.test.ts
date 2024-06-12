import { given, thenExpect, whenScriptIsTransformedToComponent } from './_testUtils';

describe('transformToCompositionAPI - Unmounted Transformations', () => {
    it('transforms unmounted lifecycle hook', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                unmounted() {
                    console.log('Component unmounted');
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { onUnmounted } from 'vue';
            onUnmounted(() => {
                console.log('Component unmounted');
            });
            </script>
        `);
    });
});

    it('transforms async unmounted lifecycle hook', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                async unmounted() {
                    await fetchData();
                    console.log('Component unmounted');
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { onUnmounted } from 'vue';
            onUnmounted(async () => {
                await fetchData();
                console.log('Component unmounted');
            });
            </script>
        `);
    });
