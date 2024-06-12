import { given, thenExpect, whenScriptIsTransformedToComponent } from './_testUtils';

describe('transformToCompositionAPI - BeforeCreate Transformations', () => {
    it('transforms beforeCreate lifecycle hook', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                beforeCreate() {
                    console.log('Component before create');
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { onBeforeCreate } from 'vue';
            onBeforeCreate(() => {
                console.log('Component before create');
            });
            </script>
        `);
    });
});

    it('transforms async beforeCreate lifecycle hook', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                async beforeCreate() {
                    await fetchData();
                    console.log('Component before create');
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { onBeforeCreate } from 'vue';
            onBeforeCreate(async () => {
                await fetchData();
                console.log('Component before create');
            });
            </script>
        `);
    });
