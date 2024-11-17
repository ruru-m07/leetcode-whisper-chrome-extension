import { ChatHistoryParsed } from '@/interface/chatHistory'
import { outputSchema } from '@/schema/modeOutput'
import { generateObject, LanguageModelV1 } from 'ai'

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
