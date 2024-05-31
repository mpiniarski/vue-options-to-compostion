import { given, thenExpect, whenScriptIsTransformed } from './_testUtils';

describe('transformComponent - Inject Transformations', () => {
    it('transforms inject property', () => {
        const optionsAPIScript = given(`
            import { defineComponent } from 'vue';

            export default defineComponent({
                inject: ['injectedValue']
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            const injectedValue = inject('injectedValue');
            </script>
        `);
    });

    it('transforms inject property with object format', () => {
        const optionsAPIScript = given(`
            import { defineComponent } from 'vue';

            export default defineComponent({
                inject: {
                    injectedValue: {
                        from: 'provideKey',
                        default: 'defaultValue'
                    }
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            const injectedValue = inject('provideKey', 'defaultValue');
            </script>
        `);
    });
});
