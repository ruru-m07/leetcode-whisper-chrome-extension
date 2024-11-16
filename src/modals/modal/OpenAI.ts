import { z } from 'zod'
import { outputSchema } from '@/schema/modeOutput'
import { ModalInterface } from '../../interface/ModalInterface'

export class OpenAI implements ModalInterface {
  name = 'openai'
  private apiKey: string = ''

  init(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateResponse(prompt: string): Promise<{
    error: Error | null
    success: z.infer<typeof outputSchema> | null
  }> {
    // TODO : Implement the logic to generate response from OpenAI
    return {
      error: null,
      success: null,
    }
  }
}
