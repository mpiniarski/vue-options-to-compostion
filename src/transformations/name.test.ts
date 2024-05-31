import { given, thenExpect, whenScriptIsTransformed } from './_testUtils';

describe('transformComponent - Name Transformation', () => {
    it('transforms name property', () => {
        const optionsAPIScript = given(`
            import { defineComponent } from 'vue';

            export default defineComponent({
                name: 'MyComponent'
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            defineComponent({ name: 'MyComponent' });
            </script>
        `);
    });
});
