import { given, thenExpect, whenScriptIsTransformed } from './_testUtils';

describe('transformComponent - Setup Transformations', () => {
    it('transforms setup property', () => {
        const optionsAPIScript = given(`
            import { defineComponent } from 'vue';

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

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            const message = 'Hello';
            console.log(message);
            </script>
        `);
    });
});
