import { createQuery } from '@farfetched/core'
import { supabase } from './config'

export interface Message {
  id: string
  created_at: string
  user: string
  body: string
}

export const messagesQuery = createQuery({
  handler: async () => {
    const { data: messages } = await supabase.from('messages').select('*')

    return messages as Message[]
  },
})
