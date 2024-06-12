import { given, thenExpect, whenScriptIsTransformedToComponent } from './_testUtils';

describe('transformToCompositionAPI - BeforeUnmount Transformations', () => {
    it('transforms beforeUnmount lifecycle hook', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                beforeUnmount() {
                    console.log('Component before unmount');
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { onBeforeUnmount } from 'vue';
            onBeforeUnmount(() => {
                console.log('Component before unmount');
            });
            </script>
        `);
    });
});

    it('transforms async beforeUnmount lifecycle hook', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                async beforeUnmount() {
                    await fetchData();
                    console.log('Component before unmount');
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { onBeforeUnmount } from 'vue';
            onBeforeUnmount(async () => {
                await fetchData();
                console.log('Component before unmount');
            });
            </script>
        `);
    });
