import { given, thenExpect, whenScriptIsTransformed } from './transformations/_testUtils';

describe('transformComponent - nextTick Transformation', () => {
    it('transforms $nextTick references to nextTick', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                methods: {
                    focusInput() {
                        this.$nextTick(() => {
                            console.log('test');
                        })
                    }
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            function focusInput() {
                nextTick(() => {
                    console.log('test');
                });
            }
            </script>
        `);
    });
});
