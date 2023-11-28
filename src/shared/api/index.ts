import { createMutation, createQuery } from '@farfetched/core'
import { Array, Record, Static, String } from 'runtypes'
import { supabase } from './config'

export const Message = Record({
  id: String,
  created_at: String,
  user: String,
  body: String,
})

export type Message = Static<typeof Message>

export const getAllMessagesQuery = createQuery({
  handler: async () => {
    const { data: messages } = await supabase.from('messages').select()
    if (Array(Message).guard(messages)) return messages
    return []
  },
})

export const sendMessageMutation = createMutation({
  handler: async ({ user, body }: Pick<Message, 'user' | 'body'>) => {
    const { data } = await supabase
      .from('messages')
      .insert([{ user, body }])
      .select()
    return data
  },
})
