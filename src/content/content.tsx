import React, { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Bot, Send } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { SYSTEM_PROMPT } from '@/constants/prompt'
import { extractCode } from './util'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { cn } from '@/lib/utils'
import { Card, CardContent, CardFooter } from '@/components/ui/card'

import { ModalService } from '@/services/ModalService'
import { useChromeStorage } from '@/hooks/useChromeStorage'
import { ChatHistory, parseChatHistory } from '@/interface/chatHistory'
import { ValidModel } from '@/constants/valid_modals'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ChatBoxProps {
  visible: boolean
  context: {
    problemStatement: string
  }
  model: ValidModel
  apikey: string
}

const ChatBox: React.FC<ChatBoxProps> = ({
  context,
  visible,
  model,
  apikey,
}) => {
  const [value, setValue] = React.useState('')
  const [chatHistory, setChatHistory] = React.useState<ChatHistory[]>([])

  const chatBoxRef = useRef<HTMLDivElement>(null)

  /**
   * Handles the generation of an AI response.
   *
   * This function performs the following steps:
   * 1. Initializes a new instance of `ModalService`.
   * 2. Selects a modal using the provided model and API key.
   * 3. Determines the programming language from the UI.
   * 4. Extracts the user's current code from the document.
   * 5. Modifies the system prompt with the problem statement, programming language, and extracted code.
   * 6. Generates a response using the modified system prompt.
   * 7. Updates the chat history with the generated response or error message.
   * 8. Scrolls the chat box into view.
   *
   * @async
   * @function handleGenerateAIResponse
   * @returns {Promise<void>} A promise that resolves when the AI response generation is complete.
   */
  const handleGenerateAIResponse = async () => {
    const modalService = new ModalService()

    modalService.selectModal(model, apikey)

    let programmingLanguage = 'UNKNOWN'

    const changeLanguageButton = document.querySelector(
      'button.rounded.items-center.whitespace-nowrap.inline-flex.bg-transparent.dark\\:bg-dark-transparent.text-text-secondary.group'
    )
    if (changeLanguageButton) {
      if (changeLanguageButton.textContent)
        programmingLanguage = changeLanguageButton.textContent
    }
    const userCurrentCodeContainer = document.querySelectorAll('.view-line')

    const extractedCode = extractCode(userCurrentCodeContainer)

    const systemPromptModified = SYSTEM_PROMPT.replace(
      '{{problem_statement}}',
      context.problemStatement
    )
      .replace('{{programming_language}}', programmingLanguage)
      .replace('{{user_code}}', extractedCode)

    const PCH = parseChatHistory(chatHistory)

    const { error, success } = await modalService.generate({
      prompt: `${value}`,
      systemPrompt: systemPromptModified,
      messages: PCH,
      extractedCode: extractedCode,
    })

    if (error) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: error.message,
        },
      ])
      chatBoxRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    if (success) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: success,
        },
      ])
      setValue('')
      chatBoxRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const onSendMessage = (value: string) => {
    setChatHistory((prev) => [...prev, { role: 'user', content: value }])
    chatBoxRef.current?.scrollIntoView({ behavior: 'smooth' })
    handleGenerateAIResponse()
  }

  if (!visible) return <></>

  return (
    <Card className="mb-5">
      <CardContent>
        <ScrollArea className="space-y-4 h-[400px] w-[500px] mt-5 p-4">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm my-2',
                message.role === 'user'
                  ? 'ml-auto bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              <>
                <p className="max-w-80">
                  {typeof message.content === 'string'
                    ? message.content
                    : message.content.feedback}
                </p>

                {!(typeof message.content === 'string') && (
                  <Accordion type="multiple">
                    {message.content?.hints &&
                      message.content.hints.length > 0 && (
                        <AccordionItem value="item-1" className="max-w-80">
                          <AccordionTrigger>Hints 👀</AccordionTrigger>
                          <AccordionContent>
                            <ul className="space-y-4">
                              {message.content?.hints?.map((e) => (
                                <li key={e}>{e}</li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                    {message.content?.snippet && (
                      <AccordionItem value="item-2" className="max-w-80">
                        <AccordionTrigger>Code 🧑🏻‍💻</AccordionTrigger>

                        <AccordionContent>
                          <pre className="bg-black p-3 rounded-md shadow-lg ">
                            <code>{message.content.snippet}</code>
                          </pre>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                )}
              </>
            </div>
          ))}
          <div ref={chatBoxRef} />
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (value.length === 0) return
            onSendMessage(value)
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            id="message"
            placeholder="Type your message..."
            className="flex-1"
            autoComplete="off"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            required
          />
          <Button type="submit" size="icon" disabled={value.length === 0}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

const ContentPage: React.FC = () => {
  const [chatboxExpanded, setChatboxExpanded] = React.useState<boolean>(false)

  const metaDescriptionEl = document.querySelector('meta[name=description]')
  const problemStatement = metaDescriptionEl?.getAttribute('content') as string

  const [modal, setModal] = React.useState<ValidModel | null | undefined>(null)
  const [apiKey, setApiKey] = React.useState<string | null | undefined>(null)

  ;(async () => {
    const { getApiKey, getModel } = useChromeStorage()
    const modal = await getModel()
    const apiKey = await getApiKey()

    setModal(modal)
    setApiKey(apiKey)
  })()

  return (
    <div
      className="dark z-50"
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
      }}
    >
      {!modal || !apiKey ? (
        !chatboxExpanded ? null : (
          <>
            <Card className="mb-5">
              <CardContent className="h-[500px] grid place-items-center">
                <div className="grid place-items-center gap-4">
                  <p className="text-center">
                    Please configure the extension before using this feature.
                  </p>
                  <Button
                    onClick={() => {
                      chrome.runtime.sendMessage({ action: 'openPopup' })
                    }}
                  >
                    configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )
      ) : (
        <ChatBox
          visible={chatboxExpanded}
          context={{ problemStatement }}
          model={modal}
          apikey={apiKey}
        />
      )}
      <div className="flex justify-end">
        <Button onClick={() => setChatboxExpanded(!chatboxExpanded)}>
          <Bot />
          Ask AI
        </Button>
      </div>
    </div>
  )
}

export default ContentPage
