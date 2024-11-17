import { ModalInterface } from '@/interface/ModalInterface'
import { ValidModel } from '@/constants/valid_modals'

import { OpenAI } from '@/modals/modal/OpenAI'
import { GeminiAI } from '@/modals/modal/GeminiAI'
import { OpenAi_4o } from './modal/OpenAI_40'

/**
 * This object contains all the modals that are available in the extension.
 * @type {Record<ValidModel, ModalInterface>}
 */
export const modals: Record<ValidModel, ModalInterface> = {
  openai: new OpenAI(),
  openai_4o: new OpenAi_4o(),
  geminiai: new GeminiAI(),
}
