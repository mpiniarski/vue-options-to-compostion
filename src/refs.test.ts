import { given, thenExpect, whenScriptIsTransformedToComponent } from './transformations/_testUtils';

describe('transformToCompositionAPI - Refs Transformation', () => {
    it('transforms $refs references to ref declarations', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                methods: {
                    focusInput() {
                        this.$refs.myInput.focus();
                    }
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            const myInput = ref<HTMLElement>();
            function focusInput() {
                myInput.value.focus();
            }
            </script>
        `);
    });
});
