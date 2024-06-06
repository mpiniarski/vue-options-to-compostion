import { given, thenExpect, whenScriptIsTransformed } from './transformations/_testUtils';

describe('transformComponent - Emit Transformation', () => {
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

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            function focusInput() {
                emit('test');
            }
            </script>
        `);
    });
});
