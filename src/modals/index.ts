import { ModalInterface } from '@/interface/ModalInterface'
import { ValidModel } from '@/constants/valid_modals'

import { OpenAI } from '@/modals/modal/OpenAI'
import { ChromeAI } from '@/modals/modal/ChromeAI'
import { GeminiAI } from '@/modals/modal/GeminiAI'

/**
 * This object contains all the modals that are available in the extension.
 * @type {Record<ValidModel, ModalInterface>}
 */
export const modals: Record<ValidModel, ModalInterface> = {
  openai: new OpenAI(),
  geminiai: new GeminiAI(),
  chromeai: new ChromeAI(),
}
