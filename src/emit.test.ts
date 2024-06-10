import { given, thenExpect, whenScriptIsTransformedToComponent } from './transformations/_testUtils';

describe('transformToCompositionAPI - Emit Transformation', () => {
    it('transforms $emit references to emit', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                methods: {
                    focusInput() {
                        this.$emit('test')
                    }
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            function focusInput() {
                emit('test');
            }
            </script>
        `);
    });
});
