import { given, thenExpect, whenScriptIsTransformed } from './_testUtils';

describe('transformComponent - BeforeUnmount Transformations', () => {
    it('transforms beforeUnmount lifecycle hook', () => {
        const optionsAPIScript = given(`
            import { defineComponent } from 'vue';

            export default defineComponent({
                beforeUnmount() {
                    console.log('Component before unmount');
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            onBeforeUnmount(() => {
                console.log('Component before unmount');
            });
            </script>
        `);
    });
});
