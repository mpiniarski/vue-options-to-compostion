import {transformComponent} from '../src/transformComponent';
import cleanUpScript from "./utils/cleanUpScript";

type TestCase = {
    name: string;
    optionsAPIScript: string;
    expectedCompositionAPIScript: string;
    only?: boolean;
    ignore?: boolean;
};

const testCases: TestCase[] = [
    // Props test cases
    {
        name: 'transforms props correctly with various types and defaults',
        optionsAPIScript: `
            import { defineComponent } from 'vue';

            export default defineComponent({
                props: {
                    message: String,
                    count: {
                        type: Number,
                        default: 0
                    },
                    isActive: {
                        type: Boolean,
                        default: false
                    },
                    user: {
                        type: Object,
                        required: false
                    }
                }
            });
        `,
        expectedCompositionAPIScript: `
            <script setup>
            const props = defineProps({
                message: String,
                count: {
                    type: Number,
                    default: 0
                },
                isActive: {
                    type: Boolean,
                    default: false
                },
                user: {
                    type: Object,
                    required: false
                }
            });
            </script>
        `
    },
    {
        name: 'transforms props correctly when provided as an array of strings',
        optionsAPIScript: `
            import { defineComponent } from 'vue';

            export default defineComponent({
                props: ['message', 'count', 'isActive', 'user']
            });
        `,
        expectedCompositionAPIScript: `
            <script setup>
            const props = defineProps(['message', 'count', 'isActive', 'user']);
            </script>
        `
    },
    // Computed test cases
    {
        name: 'transforms multiple computed properties correctly',
        optionsAPIScript: `
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
        `,
        expectedCompositionAPIScript: `
            <script setup>
            const reversedMessage = computed(() => {
                return message.split('').reverse().join('');
            });
            const upperMessage = computed(() => {
                return message.toUpperCase();
            });
            </script>
        `
    },
    // Methods test cases
    {
        name: 'transforms methods correctly with parameters',
        optionsAPIScript: `
            import { defineComponent } from 'vue';

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
        `,
        expectedCompositionAPIScript: `
            <script setup>
            function greet(name) {
                console.log(\`Hello \${name}\`);
            }
            function farewell(name, timeOfDay) {
                console.log(\`Goodbye \${name}, have a nice \${timeOfDay}\`);
            }
            </script>
        `
    },
// Watch test cases
    {
        name: 'transforms multiple watch properties correctly',
        optionsAPIScript: `
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
        `,
        expectedCompositionAPIScript: `
            <script setup>
            watch(() => message, (newValue, oldValue) => {
                console.log('Message changed from', oldValue, 'to', newValue);
            });
            watch(() => count, (newValue, oldValue) => {
                console.log('Count changed from', oldValue, 'to', newValue);
            });
            </script>
        `
    },
    {
        name: 'transforms watch properties with handler and immediate correctly',
        optionsAPIScript: `
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
        `,
        expectedCompositionAPIScript: `
            <script setup>
            watch(() => message, (newValue, oldValue) => {
                console.log('Message changed from', oldValue, 'to', newValue);
            }, { immediate: true });
            </script>
        `
    },
    {
        name: 'transforms watch properties with arrow function handler correctly',
        optionsAPIScript: `
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
        `,
        expectedCompositionAPIScript: `
            <script setup>
            watch(() => message, (newValue, oldValue) => {
                console.log('Message changed from', oldValue, 'to', newValue);
            }, { immediate: true });
            </script>
        `
    },
    // Data test cases
    {
        name: 'transforms data property when it is an object',
        optionsAPIScript: `
            import { defineComponent } from 'vue';

            export default defineComponent({
                data: {
                    message: 'Hello',
                    count: 0
                }
            });
        `,
        expectedCompositionAPIScript: `
            <script setup>
            const message = ref('Hello');
            const count = ref(0);
            </script>
        `
    },
    {
        ignore: true,
        name: 'transforms data property when it is a function returning object',
        optionsAPIScript: `
            import { defineComponent } from 'vue';

            export default defineComponent({
                data() {
                    return {
                        message: 'Hello',
                        count: 0
                    };
                }
            });
        `,
        expectedCompositionAPIScript: `
            <script setup>
            const message = ref('Hello');
            const count = ref(0);
            </script>
        `
    },
    {
        name: 'transforms data property when it is an arrow function accepting vm and returning object',
        optionsAPIScript: `
            import { defineComponent } from 'vue';

            export default defineComponent({
                data: (vm) => ({
                    message: 'Hello',
                    count: 0
                })
            });
        `,
        expectedCompositionAPIScript: `
            <script setup>
            const message = ref('Hello');
            const count = ref(0);
            </script>
        `
    },
];

describe('transformComponent', () => {
    testCases.forEach(({name, optionsAPIScript, expectedCompositionAPIScript, only, ignore }) => {
        if (ignore) {
          return  ;
        }
        const testFunction = () => {
            const result = transformComponent(optionsAPIScript.trim());
            expect(cleanUpScript(result)).toBe(cleanUpScript(expectedCompositionAPIScript));
        };
        if(only) {
            it.only(name, testFunction);
        } else {
            it(name, testFunction);
        }
    });
});
