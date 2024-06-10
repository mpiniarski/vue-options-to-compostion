import { given, thenExpect, whenScriptIsTransformedToComponent } from './_testUtils';

describe('transformToCompositionAPI - Mounted Transformations', () => {
    it('transforms mounted lifecycle hook', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                mounted() {
                    console.log('Component mounted');
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { onMounted } from 'vue';
            onMounted(() => {
                console.log('Component mounted');
            });
            </script>
        `);
    });
});
