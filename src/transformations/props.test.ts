import {given, thenExpect, whenScriptIsTransformedToComponent} from "./_testUtils";

describe('transformToCompositionAPI - Props Transformations', () => {
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

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

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

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

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

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

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

    it('transforms props correctly with optional references to props in other places', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                props: {
                    user: {
                        type: Object,
                        required: false
                    }
                },
                methods: {
                    test() {
                        return this.user?.name?.text;
                    }
                },
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { defineProps } from 'vue';
            const props = defineProps({
                user: {
                    type: Object,
                    required: false
                }
            });
            
            function test() {
                return props.user?.name?.text;
            }
            </script>
        `);
    });

    it('transforms props correctly with references to props in other places when there are duplicated in names', () => {
        const optionsAPIScript = given(`
            export default defineComponent({
                props: {
                    user: {
                        type: Object,
                        required: false
                    },
                    name: {
                        type: string
                    }
                },
                methods: {
                    test() {
                        return this.user.name.text + this.name;
                    }
                },
            });
        `);

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { defineProps } from 'vue';
            const props = defineProps({
                user: {
                    type: Object,
                    required: false
                },
                name: {
                    type: string
                }
            });
            
            function test() {
                return props.user.name.text + props.name;
            }
            </script>
        `);
    });
});
