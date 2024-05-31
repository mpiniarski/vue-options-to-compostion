import {given, thenExpect, whenScriptIsTransformed} from "./_testUtils";

describe('transformComponent - Watch Transformations', () => {
    it('transforms multiple watch properties correctly', () => {
        const optionsAPIScript = given(`
            import { defineComponent } from 'vue';

            export default defineComponent({
                watch: {
                    message(newValue, oldValue) {
                        console.log('Message changed from', oldValue, 'to', newValue);
                    },
                    count(newValue, oldValue) {
                        console.log('Count changed from', oldValue, 'to', newValue);
                    }
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            watch(() => message, (newValue, oldValue) => {
                console.log('Message changed from', oldValue, 'to', newValue);
            });
            watch(() => count, (newValue, oldValue) => {
                console.log('Count changed from', oldValue, 'to', newValue);
            });
            </script>
        `);
    });

    it('transforms watch properties with handler and immediate correctly', () => {
        const optionsAPIScript = given(`
            import { defineComponent } from 'vue';

            export default defineComponent({
                watch: {
                    message: {
                        handler(newValue, oldValue) {
                            console.log('Message changed from', oldValue, 'to', newValue);
                        },
                        immediate: true
                    }
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            watch(() => message, (newValue, oldValue) => {
                console.log('Message changed from', oldValue, 'to', newValue);
            }, { 
              immediate: true 
            });
            </script>
        `);
    });

    it('transforms watch properties with arrow function handler correctly', () => {
        const optionsAPIScript = given(`
            import { defineComponent } from 'vue';

            export default defineComponent({
                watch: {
                    message: {
                        handler: (newValue, oldValue) => {
                            console.log('Message changed from', oldValue, 'to', newValue);
                        },
                        immediate: true
                    }
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            watch(() => message, (newValue, oldValue) => {
                console.log('Message changed from', oldValue, 'to', newValue);
            }, { 
              immediate: true 
            });
            </script>
        `);
    });
});
