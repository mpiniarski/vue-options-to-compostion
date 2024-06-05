import {given, thenExpect, whenScriptIsTransformed} from "./_testUtils";

describe('transformComponent - Data Transformations', () => {
    it('transforms data property when it is an object', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                data: {
                    message: 'Hello',
                    count: 0
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            const message = ref('Hello');
            const count = ref(0);
            </script>
        `);
    });

    it.skip('transforms data property when it is a function returning object', () => {
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

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
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

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
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

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            const message = ref('Hello');
            const count = ref(0);
            function greet() {
                console.log(message.value, count.value);
            }
            </script>
        `);
    });
});
