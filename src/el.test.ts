import { given, thenExpect, whenScriptIsTransformed } from './transformations/_testUtils';

describe('transformComponent - $el Transformation', () => {
    it('transforms $el references to root ref declaration', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                mounted() {
                    this.$el.focus();
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { onMounted } from 'vue';
            // TODO: add this ref to root element in the template
            const root = ref<HTMLElement>();
            onMounted(() => {
                root.value.focus();
            });
            </script>
        `);
    });
});
