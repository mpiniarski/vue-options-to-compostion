import { given, thenExpect, whenScriptIsTransformedToComponent } from './_testUtils';

describe('transformToCompositionAPI - Setup Transformations', () => {
    it('transforms setup property', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                setup() {
                    const message = 'Hello';
                    console.log(message);
                    return {
                        message
                    };
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            const message = 'Hello';
            console.log(message);
            </script>
        `);
    });
});
