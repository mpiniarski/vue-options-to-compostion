import {given, thenExpect, whenScriptIsTransformedToComponent} from "./_testUtils";

describe('transformToCompositionAPI - Watch Transformations', () => {
    it('transforms multiple watch properties correctly', () => {
        const optionsAPIScript = given(`
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

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { watch } from 'vue';
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

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { watch } from 'vue';
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

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { watch } from 'vue';
            watch(() => message, (newValue, oldValue) => {
                console.log('Message changed from', oldValue, 'to', newValue);
            }, { 
              immediate: true 
            });
            </script>
        `);
    });
});

    it('transforms watch properties with string key correctly', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                watch: {
                    'message': function(newValue, oldValue) {
                        console.log('Message changed from', oldValue, 'to', newValue);
                    }
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { watch } from 'vue';
            watch(() => message, (newValue, oldValue) => {
                console.log('Message changed from', oldValue, 'to', newValue);
            });
            </script>
        `);
    });

