import { given, thenExpect, whenScriptIsTransformedToComponent } from './_testUtils';

describe('transformToCompositionAPI - Mixins Transformation', () => {
    it('handles mixins property and leaves it inside defineComponent', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                mixins: [Mixin1, Mixin2],
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { defineComponent } from 'vue';
            defineComponent({
                mixins: [Mixin1, Mixin2]
            });
            </script>
        `);
    });
});
