import { given, thenExpect, whenScriptIsTransformed } from './transformations/_testUtils';

describe('transformComponent - Imports Transformation', () => {
    it('keeps the imports in the transformed script', () => {
        const optionsAPIScript = given(`
            import { ref } from 'vue';
            import { someFunction } from './someModule';
            import MyComponent from '@/components/MyComponent.vue';

            export default defineComponent({
                name: 'TestComponent',
                data: {
                    message: 'Hello'
                },
                methods: {
                    greet() {
                        console.log(this.message);
                    }
                }
            });
        `);

        const compositionAPIScript = whenScriptIsTransformed(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { ref } from 'vue';
            import { someFunction } from './someModule';
            import MyComponent from '@/components/MyComponent.vue';
            import { defineComponent, ref } from 'vue';
            
            defineComponent({
                name: 'TestComponent'
            });
            const message = ref('Hello');
            function greet() {
                console.log(message.value);
            }
            </script>
        `);
    });
});
