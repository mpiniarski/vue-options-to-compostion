import { given, thenExpect, whenScriptIsTransformedToComponent } from './_testUtils';

describe('transformToCompositionAPI - Name Transformation', () => {
    it('transforms name property', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                name: 'MyComponent'
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

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
