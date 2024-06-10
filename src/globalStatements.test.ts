import { given, thenExpect, whenScriptIsTransformedToComponent } from './transformations/_testUtils';

describe('transformToCompositionAPI - global statements Transformation', () => {
    it('keeps the global statements in the transformed script', () => {
        const optionsAPIScript = given(`
            import { ref } from 'vue';
            import { someFunction } from './someModule';
            import MyComponent from '@/components/MyComponent.vue';
            
            const TEST = "test";

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

        const compositionAPIScript = whenScriptIsTransformedToComponent(optionsAPIScript);

        thenExpect(compositionAPIScript).toEqualScript(`
            <script setup>
            import { defineComponent, ref } from 'vue';
            import { ref } from 'vue';
            import { someFunction } from './someModule';
            import MyComponent from '@/components/MyComponent.vue';
            
            const TEST = "test";
            
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
