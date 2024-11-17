import { ModalInterface } from '@/interface/ModalInterface'
import { ValidModel } from '@/constants/valid_modals'

import { OpenAI_3_5_turbo } from '@/modals/modal/OpenAI'
import { GeminiAI } from '@/modals/modal/GeminiAI'
import { OpenAi_4o } from './modal/OpenAI_40'

/**
 * This object contains all the modals that are available in the extension.
 * @type {Record<ValidModel, ModalInterface>}
 */
export const modals: Record<ValidModel, ModalInterface> = {
  'openai_3.5_turbo': new OpenAI_3_5_turbo(),
  openai_4o: new OpenAi_4o(),
  geminiai: new GeminiAI(),
}
