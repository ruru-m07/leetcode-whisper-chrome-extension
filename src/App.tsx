import React, { useState } from 'react'

import leetCode from '@/assets/leetcode.png'

import { Button } from '@/components/ui/button'
import Show from '@/components/Show'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectValue,
  SelectTrigger,
} from '@/components/ui/select'
import { VALID_MODELS, type ValidModel } from './constants/valid_modals'
import { Input } from '@/components/ui/input'
import { useChromeStorage } from './hooks/useChromeStorage'

const Popup: React.FC = () => {
  const [apikey, setApikey] = React.useState<string | null>(null)
  const [model, setModel] = React.useState<ValidModel | null>(null)
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false)

  const [isloading, setIsloading] = useState<boolean>(false)
  const [submitMessage, setSubmitMessage] = useState<{
    state: 'error' | 'success'
    message: string
  } | null>(null)

  const updatestorage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsloading(true)

      const { setApiKey, setModel } = useChromeStorage()
      if (apikey && model) {
        setApiKey(apikey)
        setModel(model)
      }

      setSubmitMessage({
        state: 'success',
        message: 'API Key saved successfully',
      })
    } catch (error: any) {
      setSubmitMessage({
        state: 'error',
        message: error.message,
      })
    } finally {
      setIsloading(false)
    }
  }

  React.useEffect(() => {
    const loadOpenAPIKey = async () => {
      if (!chrome) return

      const { getApiKey, getModel } = useChromeStorage()
      const model = await getModel()
      const apiKey = await getApiKey()

      if (model) {
        setModel(model)
      }
      if (apiKey) {
        setApikey(`${apiKey.substring(0, 12)}-XXXXXX`)
      }
      setIsLoaded(true)
    }

    loadOpenAPIKey()
  }, [])

  return (
    <div className="relative p-4 w-[350px] bg-background">
      <Show show={isLoaded}>
        <div className="">
          <div className="w-full  h-20 overflow-hidden ">
            <img
              className="mx-auto h-20 w-auto"
              src={leetCode}
              width={150}
              height={150}
            />
          </div>
          <div className="text-center">
            <h1 className=" font-bold text-3xl text-white">
              LeetCode <span className="text-whisperOrange">Whisper</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Your Companion to Beat LeetCode!
            </p>
          </div>
          <form
            onSubmit={(e) => updatestorage(e)}
            className="mt-10 flex flex-col gap-2 w-full"
          >
            <div className="space-y-2">
              <label htmlFor="text" className="text-xs text-muted-foreground">
                select a model
              </label>
              <Select
                onValueChange={(v: ValidModel) => setModel(v)}
                value={model || ''}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Model</SelectLabel>
                    <SelectSeparator />
                    {VALID_MODELS.map((modelOption) => (
                      <SelectItem
                        key={modelOption.name}
                        value={modelOption.name}
                      >
                        {modelOption.model}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="text" className="text-xs text-muted-foreground">
                API Key
              </label>
              <Input
                type="text"
                required
                disabled={!model}
                value={apikey || ''}
                onChange={(e) => setApikey(e.target.value)}
                placeholder="Enter OpenAI API Key"
              />
            </div>
            <Button disabled={isloading} type="submit" className="w-full mt-2">
              save API Key
            </Button>
          </form>
          {submitMessage ? (
            <div
              className="mt-2 text-center text-sm text-muted-foreground flex items-center justify-center p-2 rounded-sm"
              style={{
                color: submitMessage.state === 'error' ? 'red' : 'green',
                border:
                  submitMessage.state === 'error'
                    ? '1px solid red'
                    : '1px solid green',
                backgroundColor:
                  submitMessage.state === 'error'
                    ? 'rgba(255, 0, 0, 0.1)'
                    : 'rgba(0, 255, 0, 0.1)',
              }}
            >
              {submitMessage.state === 'error' ? (
                <p className="text-red-500">{submitMessage.message}</p>
              ) : (
                <p className="text-green-500">{submitMessage.message}</p>
              )}
            </div>
          ) : (
            ''
          )}
          <div className="mt-7 flex items-center justify-center">
            <p className="text-sm">
              Want more features?&nbsp;
              <a
                href="https://github.com/piyushgarg-dev/leetcode-whisper-chrome-extension/issues/new"
                className="text-blue-500 hover:underline"
                target="_blank"
              >
                Request a feature!
              </a>
            </p>
          </div>
        </div>
      </Show>
    </div>
  )
}

export default Popup
