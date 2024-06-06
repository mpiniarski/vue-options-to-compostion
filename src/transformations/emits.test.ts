import { given, thenExpect, whenScriptIsTransformed } from './_testUtils';

describe('transformComponent - Emits Transformation', () => {
    it('handles emits option with array format', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                emits: ['myEvent']
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { defineEmits } from 'vue';
            const emit = defineEmits(['myEvent']);
            </script>
        `);
    });

    it('handles emits option with object format', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                emits: {
                    myEvent: null,
                    anotherEvent: payload => payload !== undefined
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { defineEmits } from 'vue';
            const emit = defineEmits({
                myEvent: null,
                anotherEvent: payload => payload !== undefined
            });
            </script>
        `);
    });
});
