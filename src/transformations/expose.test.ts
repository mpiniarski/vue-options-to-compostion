import { given, thenExpect, whenScriptIsTransformed } from './_testUtils';

describe('transformComponent - Expose Transformation', () => {
    it('handles expose option', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                expose: ['myMethod']
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { defineExpose } from 'vue';
            const expose = defineExpose(['myMethod']);
            </script>
        `);
    });
});
