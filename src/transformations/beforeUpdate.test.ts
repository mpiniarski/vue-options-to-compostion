import { given, thenExpect, whenScriptIsTransformed } from './_testUtils';

describe('transformComponent - BeforeUpdate Transformations', () => {
    it('transforms beforeUpdate lifecycle hook', () => {
        const optionsAPIScript = given(`
            import { defineComponent } from 'vue';

            export default defineComponent({
                beforeUpdate() {
                    console.log('Component before update');
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            onBeforeUpdate(() => {
                console.log('Component before update');
            });
            </script>
        `);
    });
});
