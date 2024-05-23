import { transformComponent } from '../src/transformComponent';
import cleanUpScript from "./utils/cleanUpScript";

type TestCase = {
    name: string;
    optionsAPIScript: string;
    expectedCompositionAPIScript: string;
};

const testCases: TestCase[] = [
    {
        name: 'transforms props correctly',
        optionsAPIScript: `
            import { defineComponent } from 'vue';

            export default defineComponent({
                props: {
                    message: String
                }
            });
        `,
        expectedCompositionAPIScript: `
            <script setup>
            const props = defineProps({
                message: String
            });
            </script>
        `
    },
    {
        name: 'transforms computed properties correctly',
        optionsAPIScript: `
            import { defineComponent } from 'vue';

            export default defineComponent({
                computed: {
                    reversedMessage() {
                        return this.message.split('').reverse().join('');
                    }
                }
            });
        `,
        expectedCompositionAPIScript: `
            <script setup>
            const reversedMessage = computed(() => {
                return message.split('').reverse().join('');
            });
            </script>
        `
    },
    {
        name: 'transforms methods correctly',
        optionsAPIScript: `
            import { defineComponent } from 'vue';

            export default defineComponent({
                methods: {
                    greet() {
                        console.log('Hello');
                    }
                }
            });
        `,
        expectedCompositionAPIScript: `
            <script setup>
            function greet() {
                console.log('Hello');
            }
            </script>
        `
    },
    {
        name: 'transforms watch correctly',
        optionsAPIScript: `
            import { defineComponent } from 'vue';

            export default defineComponent({
                watch: {
                    message(newValue, oldValue) {
                        console.log('Message changed from', oldValue, 'to', newValue);
                    }
                }
            });
        `,
        expectedCompositionAPIScript: `
            <script setup>
            watch(() => message, (newValue, oldValue) => {
                console.log('Message changed from', oldValue, 'to', newValue);
            });
            </script>
        `
    }
];

describe('transformComponent', () => {
    testCases.forEach(({ name, optionsAPIScript, expectedCompositionAPIScript }) => {
        it(name, () => {
            const result = transformComponent(optionsAPIScript.trim());
            expect(cleanUpScript(result)).toBe(cleanUpScript(expectedCompositionAPIScript));
        });
    });
});
