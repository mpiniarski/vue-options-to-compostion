import { given, thenExpect, whenScriptIsTransformedToComponent } from './transformations/_testUtils';

describe('transformToCompositionAPI - nextTick Transformation', () => {
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

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

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
