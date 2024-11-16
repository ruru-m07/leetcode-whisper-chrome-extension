import { ModalInterface } from '@/interface/ModalInterface'
import { ValidModal } from '@/constants/valid_modals'

import { OpenAI } from '@/modals/modal/OpenAI'
import { ChromeAI } from '@/modals/modal/ChromeAI'
import { GeminiAI } from '@/modals/modal/GeminiAI'

/**
 * This object contains all the modals that are available in the extension.
 * @type {Record<ValidModal, ModalInterface>}
 */
export const modals: Record<ValidModal, ModalInterface> = {
  openai: new OpenAI(),
  geminiai: new GeminiAI(),
  chromeai: new ChromeAI(),
}
