/**
 * List of valid models that can be used in the application.
 */
export const VALID_MODELS = [
  { model: 'gpt-3.5-turbo', name: 'openai', display: 'GPT 3.5' },
  { model: 'gpt-4o', name: 'openai_4o', display: 'GPT 4o' },
  { model: 'gemini-1.5-pro-latest', name: 'geminiai', display: 'Gemini 1.5 Pro' },
]

/**
 * Type of valid models that can be used in the application.
 */
export type ValidModel = 'openai' | 'geminiai' | 'openai_4o'
