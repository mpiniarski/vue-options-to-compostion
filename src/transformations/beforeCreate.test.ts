import { given, thenExpect, whenScriptIsTransformed } from './_testUtils';

describe('transformComponent - BeforeCreate Transformations', () => {
    it('transforms beforeCreate lifecycle hook', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                beforeCreate() {
                    console.log('Component before create');
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            onBeforeCreate(() => {
                console.log('Component before create');
            });
            </script>
        `);
    });
});
