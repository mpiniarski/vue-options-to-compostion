import { given, thenExpect, whenScriptIsTransformedToComposable } from './transformations/_testUtils';

describe('transformToCompositionAPI - Mixin Type Transformation', () => {
    it('transforms data property when it is a mixin', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                data() {
                    return {
                        message: 'Hello',
                        count: 0
                    };
                }
            });
        `);

        const composableScript = whenScriptIsTransformedToComposable(optionsAPIScript);

        thenExpect(composableScript).toEqualScript(`
            import { ref } from 'vue';
            export default function useXXX() {
                const message = ref('Hello');
                const count = ref(0);
                return {
                    message,
                    count
                };
            }
        `);
    });

    it('transforms methods property when it is a mixin', () => {
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

        const composableScript = whenScriptIsTransformedToComposable(optionsAPIScript);

        thenExpect(composableScript).toEqualScript(`
            export default function useXXX() {
                function greet(name) {
                    console.log(\`Hello \${name}\`);
                }
                function farewell(name, timeOfDay) {
                    console.log(\`Goodbye \${name}, have a nice \${timeOfDay}\`);
                }
                return {
                    greet,
                    farewell
                };
            }
        `);
    });

    it('transforms lifecycle hooks when it is a mixin', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                mounted() {
                    console.log('Component mounted');
                }
            });
        `);

        const composableScript = whenScriptIsTransformedToComposable(optionsAPIScript);

        thenExpect(composableScript).toEqualScript(`
            import { onMounted } from 'vue';
            export default function useXXX() {
                onMounted(() => {
                    console.log('Component mounted');
                });
                return {
                };
            }
        `);
    });
});
