import { outputSchema } from '@/schema/modeOutput'
import { z } from 'zod'

export interface ChatHistory {
  role: 'system' | 'user' | 'assistant' | 'function' | 'data' | 'tool'
  content: string | z.infer<typeof outputSchema>
}
