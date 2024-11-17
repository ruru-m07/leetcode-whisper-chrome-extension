import { z } from 'zod'
import { ValidModel } from '@/constants/valid_modals'
import { modals } from '@/modals'
import { ModalInterface } from '@/interface/ModalInterface'
import { outputSchema } from '@/schema/modeOutput'
import { ChatHistoryParsed } from '@/interface/chatHistory'

export class ModalService {
  private activeModal: ModalInterface | null = null

  selectModal(modalName: ValidModel, apiKey?: string) {
    if (modals[modalName]) {
      this.activeModal = modals[modalName]
      this.activeModal.init(apiKey)
    } else {
      throw new Error(`Modal "${modalName}" not found`)
    }
  }

  async generate(
    prompt: string,
    systemPrompt: string,
    messages: ChatHistoryParsed[] | [],
    extractedCode?: string
  ): Promise<
    Promise<{
      error: Error | null
      success: z.infer<typeof outputSchema> | null
    }>
  > {
    if (!this.activeModal) {
      throw new Error('No modal selected')
    }
    return this.activeModal.generateResponse(
      prompt,
      systemPrompt,
      messages,
      extractedCode
    )
  }
}
