import { z } from 'zod'
import { ModalInterface } from '../interface/ModalInterface'
import { outputSchema } from '@/schema/modeOutput'

/**
 * This class is the base class for all modals.
 * It implements the interface defined above.
 * It provides a base implementation for the `generateResponse` method.
 * It also defines an abstract method that must be implemented by all subclasses.
 */
export abstract class BaseModal extends ModalInterface {
  protected apiKey: string = ''

  init(apiKey: string) {
    this.apiKey = apiKey
  }

  protected abstract makeApiCall(
    prompt: string,
    systemPrompt: string
  ): Promise<{
    error: Error | null
    success: z.infer<typeof outputSchema> | null
  }>

  async generateResponse(
    prompt: string,
    systemPrompt: string
  ): Promise<{
    error: Error | null
    success: z.infer<typeof outputSchema> | null
  }> {
    return this.makeApiCall(prompt, systemPrompt)
  }
}
