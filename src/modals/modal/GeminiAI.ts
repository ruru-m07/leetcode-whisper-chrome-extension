import { ModalInterface } from '../../interface/ModalInterface'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { z } from 'zod'
import { outputSchema } from '@/schema/modeOutput'
import { ChatHistoryParsed } from '@/interface/chatHistory'
import { generateObjectResponce } from '../utils'

export class GeminiAI implements ModalInterface {
  name = 'geminiai'
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
      const google = createGoogleGenerativeAI({
        apiKey: this.apiKey,
      })

      let data = await generateObjectResponce({
        model: google('gemini-1.5-pro-latest'),
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
