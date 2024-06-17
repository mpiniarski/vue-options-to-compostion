import { given, thenExpect, whenScriptIsTransformedToComponent } from './transformations/_testUtils';

describe('transformToCompositionAPI - $options.name (componentName)', () => {
    it('transforms $options.name references correctly', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                methods: {
                    getName() {
                        return this.$options.name;
                    }
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { getCurrentInstance } from 'vue';
            const componentName = getCurrentInstance()?.type.__name;
            function getName() {
                return componentName;
            }
            </script>
        `);
    });
});
