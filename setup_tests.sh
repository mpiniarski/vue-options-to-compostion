#!/bin/bash

# Create the necessary helper functions
mkdir -p tests/helpers

cat <<EOL > tests/helpers/index.ts
import { transformComponent } from '../../src/transformComponent';
import cleanUpScript from "../utils/cleanUpScript";

export function givenOptionsAPIScript(script: string) {
    return script.trim();
}

export function whenTransformComponent(script: string) {
    return transformComponent(script);
}

export function then(result: string, expected: string) {
    expect(cleanUpScript(result)).toBe(cleanUpScript(expected));
}
EOL

# Refactor the main test file to import and use the helper functions
cat <<EOL > tests/transformComponent.test.ts
import { givenOptionsAPIScript, whenTransformComponent, then } from './helpers';
import { DATA_TEST_CASES } from './cases/transformations/data';
import { PROPS_TEST_CASES } from './cases/transformations/props';
import { COMPUTED_TEST_CASES } from './cases/transformations/computed';
import { METHODS_TEST_CASES } from './cases/transformations/methods';
import { WATCH_TEST_CASES } from './cases/transformations/watch';

describe('transformComponent - Data Transformations', () => {
    DATA_TEST_CASES.forEach(({ name, optionsAPIScript, expectedCompositionAPIScript }) => {
        it(name, () => {
            const script = givenOptionsAPIScript(optionsAPIScript);
            const result = whenTransformComponent(script);
            then(result, expectedCompositionAPIScript);
        });
    });
});

describe('transformComponent - Props Transformations', () => {
    PROPS_TEST_CASES.forEach(({ name, optionsAPIScript, expectedCompositionAPIScript }) => {
        it(name, () => {
            const script = givenOptionsAPIScript(optionsAPIScript);
            const result = whenTransformComponent(script);
            then(result, expectedCompositionAPIScript);
        });
    });
});

describe('transformComponent - Computed Transformations', () => {
    COMPUTED_TEST_CASES.forEach(({ name, optionsAPIScript, expectedCompositionAPIScript }) => {
        it(name, () => {
            const script = givenOptionsAPIScript(optionsAPIScript);
            const result = whenTransformComponent(script);
            then(result, expectedCompositionAPIScript);
        });
    });
});

describe('transformComponent - Methods Transformations', () => {
    METHODS_TEST_CASES.forEach(({ name, optionsAPIScript, expectedCompositionAPIScript }) => {
        it(name, () => {
            const script = givenOptionsAPIScript(optionsAPIScript);
            const result = whenTransformComponent(script);
            then(result, expectedCompositionAPIScript);
        });
    });
});

describe('transformComponent - Watch Transformations', () => {
    WATCH_TEST_CASES.forEach(({ name, optionsAPIScript, expectedCompositionAPIScript }) => {
        it(name, () => {
            const script = givenOptionsAPIScript(optionsAPIScript);
            const result = whenTransformComponent(script);
            then(result, expectedCompositionAPIScript);
        });
    });
});
EOL

# Refactor each test case file to export individual test cases instead of arrays
cat <<EOL > tests/cases/transformations/data.ts
import { TestCase } from '../../types';

export const DATA_TEST_CASES: TestCase[] = [
    {
        name: 'transforms data property when it is an object',
        optionsAPIScript: \\\`
            import { defineComponent } from 'vue';

            export default defineComponent({
                data: {
                    message: 'Hello',
                    count: 0
                }
            });
        \\\`,
        expectedCompositionAPIScript: \\\`
            <script setup>
            const message = ref('Hello');
            const count = ref(0);
            </script>
        \\\`
    },
    {
        name: 'transforms data property when it is a function returning object',
        optionsAPIScript: \\\`
            import { defineComponent } from 'vue';

            export default defineComponent({
                data() {
                    return {
                        message: 'Hello',
                        count: 0
                    };
                }
            });
        \\\`,
        expectedCompositionAPIScript: \\\`
            <script setup>
            const message = ref('Hello');
            const count = ref(0);
            </script>
        \\\`
    },
    {
        name: 'transforms data property when it is an arrow function accepting vm and returning object',
        optionsAPIScript: \\\`
            import { defineComponent } from 'vue';

            export default defineComponent({
                data: (vm) => ({
                    message: 'Hello',
                    count: 0
                })
            });
        \\\`,
        expectedCompositionAPIScript: \\\`
            <script setup>
            const message = ref('Hello');
            const count = ref(0);
            </script>
        \\\`
    },
];
EOL

cat <<EOL > tests/cases/transformations/props.ts
import { TestCase } from '../../types';

export const PROPS_TEST_CASES: TestCase[] = [
    {
        name: 'transforms props correctly with various types and defaults',
        optionsAPIScript: \\\`
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
        \\\`,
        expectedCompositionAPIScript: \\\`
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
        \\\`
    },
    {
        name: 'transforms props correctly when provided as an array of strings',
        optionsAPIScript: \\\`
            import { defineComponent } from 'vue';

            export default defineComponent({
                props: ['message', 'count', 'isActive', 'user']
            });
        \\\`,
        expectedCompositionAPIScript: \\\`
            <script setup>
            const props = defineProps(['message', 'count', 'isActive', 'user']);
            </script>
        \\\`
    },
];
EOL

cat <<EOL > tests/cases/transformations/computed.ts
import { TestCase } from '../../types';

export const COMPUTED_TEST_CASES: TestCase[] = [
    {
        name: 'transforms multiple computed properties correctly',
        optionsAPIScript: \\\`
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
        \\\`,
        expectedCompositionAPIScript: \\\`
            <script setup>
            const reversedMessage = computed(() => {
                return message.split('').reverse().join('');
            });
            const upperMessage = computed(() => {
                return message.toUpperCase();
            });
            </script>
        \\\`
    },
];
EOL

cat <<EOL > tests/cases/transformations/methods.ts
import { TestCase } from '../../types';

export const METHODS_TEST_CASES: TestCase[] = [
    {
        name: 'transforms methods correctly with parameters',
        optionsAPIScript: \\\`
            import { defineComponent } from 'vue';

            export default defineComponent({
                methods: {
                    greet(name) {
                        console.log(\`Hello \\\\\\\${name}\`);
                    },
                    farewell(name, timeOfDay) {
                        console.log(\`Goodbye \\\\\\\${name}, have a nice \\\\\\\${timeOfDay}\`);
                    }
                }
            });
        \\\`,
        expectedCompositionAPIScript: \\\`
            <script setup>
            function greet(name) {
                console.log(\`Hello \\\\\\\${name}\`);
            }
            function farewell(name, timeOfDay) {
                console.log(\`Goodbye \\\\\\\${name}, have a nice \\\\\\\${timeOfDay}\`);
            }
            </script>
        \\\`
    },
];
EOL

cat <<EOL > tests/cases/transformations/watch.ts
import { TestCase } from '../../types';

export const WATCH_TEST_CASES: TestCase[] = [
    {
        name: 'transforms multiple watch properties correctly',
        optionsAPIScript: \\\`
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
        \\\`,
        expectedCompositionAPIScript: \\\`
            <script setup>
            watch(() => message, (newValue, oldValue) => {
                console.log('Message changed from', oldValue, 'to', new
