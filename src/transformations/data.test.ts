import {given, thenExpect, whenScriptIsTransformedToComponent} from "./_testUtils";

describe('transformToCompositionAPI - Data Transformations', () => {
    it('transforms data property when it is an object', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                data: {
                    message: 'Hello',
                    count: 0
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { ref } from 'vue';
            const message = ref('Hello');
            const count = ref(0);
            </script>
        `);
    });

    it('transforms data property when it is a function returning object', () => {
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

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { ref } from 'vue';
            const message = ref('Hello');
            const count = ref(0);
            </script>
        `);
    });

    it('transforms data property when it is an arrow function accepting vm and returning object', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                data: (vm) => ({
                    message: 'Hello',
                    count: 0
                })
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { ref } from 'vue';
            const message = ref('Hello');
            const count = ref(0);
            </script>
        `);
    });

    it('transforms data property and adds .value to usages', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                data: {
                    message: 'Hello',
                    count: 0
                },
                methods: {
                    greet() {
                        console.log(this.message, this.count);
                    }
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { ref } from 'vue';
            const message = ref('Hello');
            const count = ref(0);
            function greet() {
                console.log(message.value, count.value);
            }
            </script>
        `);
    });
});
