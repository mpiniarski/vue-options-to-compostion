import {given, thenExpect, whenScriptIsTransformed} from "./_testUtils";

describe('transformComponent - Props Transformations', () => {
    it('transforms props correctly with various types and defaults', () => {
         const optionsAPIScript = given(`
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
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { defineProps } from 'vue';
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
        `);
    });

    it('transforms props correctly when provided as an array of strings', () => {
         const optionsAPIScript = given(`
            export default defineComponent({
                props: ['message', 'count', 'isActive', 'user']
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { defineProps } from 'vue';
            const props = defineProps(['message', 'count', 'isActive', 'user']);
            </script>
        `);
    });

    it('transforms props correctly with references to props in other places', () => {
        const optionsAPIScript = given(`
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
                },
                methods: {
                    test() {
                        return this.count * 2;
                    }
                },
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { defineProps } from 'vue';
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
            
            function test() {
                return props.count * 2;
            }
            </script>
        `);
    });
});
