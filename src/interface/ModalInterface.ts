import { outputSchema } from "@/schema/modeOutput"
import { z } from "zod"

/**
 * This interface defines the structure of a modal.
 * It has a name property and two methods.
 * The `init` method is used to initialize the modal with the API key.
 * The `generateResponse` method is used to generate a response from the modal.
 * It takes a prompt as an argument and returns a promise that resolves to a string.
 */
export abstract class ModalInterface {
  abstract name: string
  abstract init(apiKey?: string): void
  abstract generateResponse(
    prompt: string,
    systemPrompt: string
  ): Promise<{
    error: Error | null
    success: z.infer<typeof outputSchema> | null
  }>
}
