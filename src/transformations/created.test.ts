import { given, thenExpect, whenScriptIsTransformed } from "./_testUtils";

describe('transformComponent - Created Transformation', () => {
    it('transforms created lifecycle hook as function correctly', () => {
        const optionsAPIScript = given(`
            import { defineComponent } from 'vue';

            export default defineComponent({
                created() {
                    console.log('Component created');
                }
            });
        `);
        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            console.log('Component created');
            </script>
        `);
    });

    it('transforms created lifecycle as inline function hook correctly', () => {
        const optionsAPIScript = given(`
            import { defineComponent } from 'vue';

            export default defineComponent({
                created: function() {
                    console.log('Component created');
                }
            });
        `);
        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            console.log('Component created');
            </script>
        `);
    });

    it('handles created lifecycle hook with undefined body gracefully', () => {
        const optionsAPIScript = given(`
            import { defineComponent } from 'vue';

            export default defineComponent({
                created: function() {}
            });
        `);
        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            </script>
        `);
    });

    it('handles invalid created lifecycle hook property gracefully', () => {
        const optionsAPIScript = given(`
            import { defineComponent } from 'vue';

            export default defineComponent({
                created: "invalid"
            });
        `);
        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            </script>
        `);
    });
});
