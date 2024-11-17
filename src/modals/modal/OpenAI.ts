import { z } from 'zod'
import { outputSchema } from '@/schema/modeOutput'
import { ModalInterface } from '../../interface/ModalInterface'
import { createOpenAI } from '@ai-sdk/openai'
import { ChatHistoryParsed } from '@/interface/chatHistory'
import { generateObjectResponce } from '../utils'

export class OpenAI implements ModalInterface {
  name = 'openai'
  private apiKey: string = ''

  init(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateResponse(
    prompt: string,
    systemPrompt: string,
    messages: ChatHistoryParsed[] | [],
    extractedCode?: string
  ): Promise<{
    error: Error | null
    success: z.infer<typeof outputSchema> | null
  }> {
    try {
      const openai = createOpenAI({
        compatibility: 'strict',
        apiKey: this.apiKey,
      })

      let data = await generateObjectResponce({
        model: openai('gpt-3.5-turbo'),
        messages,
        systemPrompt,
        prompt,
        extractedCode,
      })

      return {
        error: null,
        success: data.object,
      }
    } catch (error: any) {
      return { error, success: null }
    }
  }
}
