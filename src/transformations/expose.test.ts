import { given, thenExpect, whenScriptIsTransformedToComponent } from './_testUtils';

describe('transformToCompositionAPI - Expose Transformation', () => {
    it('handles expose option', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                expose: ['myMethod']
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { defineExpose } from 'vue';
            const expose = defineExpose(['myMethod']);
            </script>
        `);
    });
});
