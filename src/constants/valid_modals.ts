/**
 * List of valid modals that can be used in the application.
 */
export const VALID_MODALS = [
  { modal: 'chatgpt-4o-latest', name: 'openai' },
  { modal: 'gemini-1.0-pro', name: 'geminiai' },
  { modal: 'chrome-ai', name: 'chromeai' },
]
export type ValidModal = 'openai' | 'geminiai' | 'chromeai'
