import React, { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Bot, ClipboardCopy, Send } from 'lucide-react'

import './style.css'
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
import { ChatHistory } from '@/interface/chatHistory'

interface ChatBoxProps {
  visible: boolean
  context: {
    problemStatement: string
  }
}

function ChatBox({ context, visible }: ChatBoxProps) {
  const [value, setValue] = React.useState('')
  const [chatHistory, setChatHistory] = React.useState<ChatHistory[]>([])

  const chatBoxRef = useRef<HTMLDivElement>(null)

  const handleGenerateAIResponse = async () => {
    const modalService = new ModalService()

    const { getApiKey, getModal } = useChromeStorage()
    const modal = await getModal()
    const apiKey = await getApiKey()

    if (!modal || !apiKey) {
      // TODO : will heandel this later
      console.log("modal or api key doesn't exist")
      return
    }

    modalService.selectModal(modal, apiKey)

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

    console.log({
      prompt: `User Prompt: ${value}\nCode: ${extractedCode}`,
      systemPrompt: systemPromptModified,
    })

    const { error, success } = await modalService.generate(
      `User Prompt: ${prompt}\nCode: ${extractedCode}`,
      systemPromptModified
    )

    if (error) {
      console.log('error:::', error)
    }

    if (success) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: success,
        },
      ])
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
        <div className="space-y-4 h-[400px] w-[500px] overflow-auto mt-5">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={cn(
                'flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm',
                message.role === 'user'
                  ? 'ml-auto bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              <>
                <p>
                  {typeof message.content === 'string'
                    ? message.content
                    : message.content.feedback}
                </p>

                {!(typeof message.content === 'string') && (
                  <Accordion type="multiple">
                    {message.content?.hints && message.content.hints.length > 0 && (
                      <AccordionItem value="item-1">
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
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Code 🧑🏻‍💻</AccordionTrigger>

                        <AccordionContent>
                          <pre className="bg-black p-3 rounded-md shadow-lg ">
                            <code>{message.content.snippet}</code>
                          </pre>
                          {/* <Button
                            className="p-0 mt-2"
                            size="small"
                            variant="tertiary"
                            onClick={() =>
                              navigator.clipboard.writeText(
                                `${message.content?.snippet}`
                              )
                            }
                          >
                            <ClipboardCopy />
                          </Button> */}
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>
                )}
              </>
            </div>
          ))}
          <div ref={chatBoxRef} />
        </div>
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

  return (
    <div className="__chat-container dark z-50">
      <ChatBox visible={chatboxExpanded} context={{ problemStatement }} />
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
