import { given, thenExpect, whenScriptIsTransformedToComponent } from './_testUtils';

describe('transformToCompositionAPI - BeforeMount Transformations', () => {
    it('transforms beforeMount lifecycle hook', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                beforeMount() {
                    console.log('Component before mount');
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { onBeforeMount } from 'vue';
            onBeforeMount(() => {
                console.log('Component before mount');
            });
            </script>
        `);
    });
});
