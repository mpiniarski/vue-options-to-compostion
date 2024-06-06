import { given, thenExpect, whenScriptIsTransformed } from './_testUtils';

describe('transformComponent - Mounted Transformations', () => {
    it('transforms mounted lifecycle hook', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                mounted() {
                    console.log('Component mounted');
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

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
