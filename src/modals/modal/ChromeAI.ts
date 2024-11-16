import { outputSchema } from '@/schema/modeOutput'
import { ModalInterface } from '../../interface/ModalInterface'
import { generateText } from 'ai'
import { chromeai } from 'chrome-ai'
import { z } from 'zod'

export class ChromeAI implements ModalInterface {
  name = 'ChromeAI'
  // @ts-ignore
  private apiKey: string = ''

  init(apiKey: string) {
    this.apiKey = apiKey
  }

  // ! cuz of some browser issue we pass thi todo for now.
  // ! we will implement this later  :)

  async generateResponse(prompt: string): Promise<{
    error: Error | null
    success: z.infer<typeof outputSchema> | null
  }> {
    const { text } = await generateText({
      model: chromeai(),
      prompt: prompt,
    })

    // TODO : Implement the logic to generate response from ChromeAI
    return {
      error: null,
      success: null,
    }
  }
}
