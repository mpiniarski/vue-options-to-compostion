import {given, thenExpect, whenScriptIsTransformed} from "./_testUtils";

describe('transformComponent - Methods Transformations', () => {
    it('transforms methods correctly with parameters', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                methods: {
                    greet(name) {
                        console.log(\`Hello \${name}\`);
                    },
                    farewell(name, timeOfDay) {
                        console.log(\`Goodbye \${name}, have a nice \${timeOfDay}\`);
                    }
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            function greet(name) {
                console.log(\`Hello \${name}\`);
            }
            function farewell(name, timeOfDay) {
                console.log(\`Goodbye \${name}, have a nice \${timeOfDay}\`);
            }
            </script>
        `);
    });
});
