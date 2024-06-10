import { given, thenExpect, whenScriptIsTransformedToComponent } from './_testUtils';

describe('transformToCompositionAPI - BeforeUpdate Transformations', () => {
    it('transforms beforeUpdate lifecycle hook', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                beforeUpdate() {
                    console.log('Component before update');
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { onBeforeUpdate } from 'vue';
            onBeforeUpdate(() => {
                console.log('Component before update');
            });
            </script>
        `);
    });
});
