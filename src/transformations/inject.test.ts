import { given, thenExpect, whenScriptIsTransformedToComponent } from './_testUtils';

describe('transformToCompositionAPI - Inject Transformations', () => {
    it('transforms inject property', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                inject: ['injectedValue']
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { inject } from 'vue';
            const injectedValue = inject('injectedValue');
            </script>
        `);
    });

    it('transforms inject property with object format', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                inject: {
                    injectedValue: {
                        from: 'provideKey',
                        default: 'defaultValue'
                    }
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { inject } from 'vue';
            const injectedValue = inject('provideKey', 'defaultValue');
            </script>
        `);
    });
});
