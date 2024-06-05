import { given, thenExpect, whenScriptIsTransformed } from './_testUtils';

describe('transformComponent - Mixins Transformation', () => {
    it('handles mixins property and leaves it inside defineComponent', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                mixins: [Mixin1, Mixin2],
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            defineComponent({
                mixins: [Mixin1, Mixin2]
            });
            </script>
        `);
    });
});
