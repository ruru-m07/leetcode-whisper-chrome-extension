import { generateObject } from 'ai'
import { ModalInterface } from '../../interface/ModalInterface'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { z } from 'zod'
import { outputSchema } from '@/schema/modeOutput'

export class GeminiAI implements ModalInterface {
  name = 'geminiai'
  private apiKey: string = ''

  init(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateResponse(
    prompt: string,
    systemPrompt: string
  ): Promise<{
    error: Error | null
    success: z.infer<typeof outputSchema> | null
  }> {
    try {
      const google = createGoogleGenerativeAI({
        apiKey: this.apiKey,
      })

      const data = await generateObject({
        model: google('gemini-1.5-pro-latest'),
        prompt,
        schema: outputSchema,
        output: 'object',
        system: systemPrompt,
      })

      return { error: null, success: data.object }
    } catch (error: any) {
      return { error, success: null }
    }
  }
}
