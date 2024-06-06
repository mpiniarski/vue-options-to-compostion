import { given, thenExpect, whenScriptIsTransformed } from './_testUtils';

describe('transformComponent - Name Transformation', () => {
    it('transforms name property', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                name: 'MyComponent'
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { defineComponent } from 'vue';
            defineComponent({ 
              name: 'MyComponent' 
            });
            </script>
        `);
    });
});
