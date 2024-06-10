import { given, thenExpect, whenScriptIsTransformedToComponent } from "./_testUtils";

describe('transformToCompositionAPI - Methods Transformations', () => {
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

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

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

    it('transforms async methods correctly', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                methods: {
                    async fetchData() {
                        const response = await fetch('/api/data');
                        const data = await response.json();
                        console.log(data);
                    }
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            async function fetchData() {
                const response = await fetch('/api/data');
                const data = await response.json();
                console.log(data);
            }
            </script>
        `);
    });
});
