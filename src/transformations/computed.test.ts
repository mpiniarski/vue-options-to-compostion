import {given, thenExpect, whenScriptIsTransformed} from "./_testUtils";

describe('transformComponent - Computed Transformations', () => {
    it('transforms multiple computed properties correctly', () => {
        const optionsAPIScript = given(`
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
    it('transforms computed property and adds .value to usages', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                computed: {
                    message() {
                        return 'Hello';
                    },
                    count() {
                        return 0;
                    },
                },
                methods: {
                    greet() {
                        console.log(this.message, this.count);
                    },
                },
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            const message = computed(() => {
              return 'Hello';
            });
            const count = computed(() => {
              return 0;
            });
            function greet() {
                console.log(message.value, count.value);
            }
            </script>
        `);
    });});
