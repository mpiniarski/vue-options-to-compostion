import { given, thenExpect, whenScriptIsTransformedToComposable } from './_testUtils';

describe('transformToCompositionAPI - Props Transformation for Composable', () => {
    it('transforms props correctly and exports as USE_XXX_PROPS', () => {
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

        const composableScript = whenScriptIsTransformedToComposable(optionsAPIScript);

        thenExpect(composableScript).toEqualScript(`
            export const USE_XXX_PROPS = {
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
            };
            
            export default function useXXX(props) {
                return {
                };
            }
        `);
    });
});
