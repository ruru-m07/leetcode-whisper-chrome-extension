import { ChatHistoryParsed } from '@/interface/chatHistory'
import { outputSchema } from '@/schema/modeOutput'
import { generateObject, LanguageModelV1 } from 'ai'

/**
 * Generates an object response based on the provided parameters.
 *
 * @param {Object} params - The parameters for generating the object response.
 * @param {ChatHistoryParsed[] | []} params.messages - The chat history messages.
 * @param {string} params.systemPrompt - The system prompt to use.
 * @param {string} params.prompt - The user prompt to use.
 * @param {string} [params.extractedCode] - Optional extracted code to include in the messages.
 * @param {LanguageModelV1} params.model - The language model to use.
 * @returns {Promise<any>} The generated object response.
 */
export const generateObjectResponce = async ({
  messages,
  systemPrompt,
  prompt,
  extractedCode,
  model,
}: {
  messages: ChatHistoryParsed[] | []
  systemPrompt: string
  prompt: string
  extractedCode?: string
  model: LanguageModelV1
}) => {
  let data

  if (messages.length <= 1) {
    data = await generateObject({
      model: model,
      schema: outputSchema,
      output: 'object',
      system: systemPrompt,
      prompt: prompt,
    })
  } else {
    data = await generateObject({
      model: model,
      schema: outputSchema,
      output: 'object',
      system: systemPrompt,
      messages: extractedCode
        ? [{ role: 'data', content: extractedCode }, ...messages]
        : messages,
    })
  }

  return data
}
