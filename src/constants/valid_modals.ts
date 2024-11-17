/**
 * List of valid models that can be used in the application.
 */
export const VALID_MODELS = [
  { model: 'gpt-3.5-turbo', name: 'openai' },
  { model: 'gemini-1.5-pro-latest', name: 'geminiai' },
]

/**
 * Type of valid models that can be used in the application.
 */
export type ValidModel = 'openai' | 'geminiai'
