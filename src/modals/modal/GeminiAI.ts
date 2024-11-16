import { generateText } from 'ai'
import { ModalInterface } from '../../interface/ModalInterface'
import { createGoogleGenerativeAI } from '@ai-sdk/google'

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
    success: string | null
  }> {
    try {
      const google = createGoogleGenerativeAI({
        apiKey: this.apiKey,
      })

      const { text } = await generateText({
        model: google('gemini-1.5-pro-latest', {
          safetySettings: [
            {
              category: 'HARM_CATEGORY_HARASSMENT',
              threshold: 'BLOCK_LOW_AND_ABOVE',
            },
          ],
        }),
        prompt: prompt,
        system: systemPrompt,
      })

      return { error: null, success: text }
    } catch (error: any) {
      return { error: error, success: null }
    }
  }
}
