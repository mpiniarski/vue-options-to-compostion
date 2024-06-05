import { given, thenExpect, whenScriptIsTransformed } from './_testUtils';

describe('transformComponent - Unmounted Transformations', () => {
    it('transforms unmounted lifecycle hook', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                unmounted() {
                    console.log('Component unmounted');
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            onUnmounted(() => {
                console.log('Component unmounted');
            });
            </script>
        `);
    });
});
