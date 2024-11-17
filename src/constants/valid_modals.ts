/**
 * List of valid models that can be used in the application.
 */
export const VALID_MODELS = [
  { model: 'chatgpt-4o-latest', name: 'openai' },
  { model: 'gemini-1.0-pro', name: 'geminiai' },
  { model: 'chrome-ai', name: 'chromeai' },
]
export type ValidModel = 'openai' | 'geminiai' | 'chromeai'
