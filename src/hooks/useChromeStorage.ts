import { ValidModel } from '@/constants/valid_modals'

export const useChromeStorage = () => {
  const setItem = async <T>(key: string, value: T): Promise<void> => {
    await chrome.storage.local.set({ [key]: value })
  }

  const getItem = async <T>(key: string): Promise<T | undefined> => {
    const result = await chrome.storage.local.get(key)
    return result[key] as T | undefined
  }

  return {
    setApiKey: (apiKey: string) => setItem('apiKey', apiKey),
    setModel: (model: ValidModel) => setItem('model', model),
    getApiKey: () => getItem<string>('apiKey'),
    getModel: () => getItem<ValidModel>('model'),
  }
}
