/**
 * List of valid models that can be used in the application.
 */
export const VALID_MODELS = [
  {
    model: 'gpt-3.5-turbo',
    name: 'openai_3.5_turbo',
    display: 'gpt-3.5-turbo',
  },
  { model: 'gpt-4o', name: 'openai_4o', display: 'gpt-4o' },
  {
    model: 'gemini-1.5-pro-latest',
    name: 'gemini_1.5_pro',
    display: 'gemini-1.5-pro-latest',
  },
]

/**
 * Type of valid models that can be used in the application.
 */
export type ValidModel = 'openai_3.5_turbo' | 'openai_4o' | 'gemini_1.5_pro'
