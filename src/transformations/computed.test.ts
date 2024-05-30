import {given, thenExpect, whenScriptIsTransformed} from "./_testUtils";

describe('transformComponent - Computed Transformations', () => {
    it('transforms multiple computed properties correctly', () => {
        const optionsAPIScript = given(`
            import { defineComponent } from 'vue';

            export default defineComponent({
                computed: {
                    reversedMessage() {
                        return this.message.split('').reverse().join('');
                    },
                    upperMessage() {
                        return this.message.toUpperCase();
                    }
                }
            });
        `);
        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            const reversedMessage = computed(() => {
                return message.split('').reverse().join('');
            });
            const upperMessage = computed(() => {
                return message.toUpperCase();
            });
            </script>
        `);
    });
});
