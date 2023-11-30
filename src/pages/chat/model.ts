import { Message, MessageParams } from '@shared/api'
import * as api from '@shared/api'
import { supabase } from '@shared/api/config'
import { routes } from '@shared/routing'
import {
  createEffect,
  createEvent,
  createStore,
  restore,
  sample,
} from 'effector'
import persist from 'effector-localstorage'
import { empty, not, or, reset } from 'patronum'
import { ChangeEvent } from 'react'

type Nullable<T> = T | null

export const createField = <Value, Error>(defaultValue: Value) => {
  const $error = createStore<Nullable<Error>>(null)
  const $set = createEvent<Value>()
  const $value = restore($set, defaultValue)
  return [$value, $set, $error] as const
}

export const currentRoute = routes.chat

export const [$username, usernameChanged, $usernameError] = createField<
  string,
  'empty'
>('')

export const [$message, messageChanged, $messageError] = createField<
  string,
  'empty'
>('')

export const handleUsernameChange = usernameChanged.prepend(
  (event: ChangeEvent<HTMLInputElement>) => event.currentTarget.value,
)

export const handleMessageChange = messageChanged.prepend(
  (event: ChangeEvent<HTMLInputElement>) => event.currentTarget.value,
)

export const $user = createStore<Nullable<string>>(null)
export const $messages = createStore<Message[]>([])
export const $messageFormDisabled = or(
  not($user),
  api.sendMessageMutation.$pending,
)
export const $messageFormValid = not(or(empty($user), $messageError))
export const $usernameFormValid = not($usernameError)

export const pageStarted = createEvent()
export const userLoggedOut = createEvent()
export const clearMessage = createEvent()
export const messageFormSubmitted = createEvent()
export const usernameFormSubmitted = createEvent()

const channel = supabase
  .channel('chat-channel')
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'messages' },
    (payload) => newMessageDelivered(payload.new as Message),
  )

export const channelSubribeFx = createEffect(() => channel.subscribe())
export const channelUnsubribeFx = createEffect(() => channel.unsubscribe())

const newMessageDelivered = createEvent<Nullable<Message>>()
const $newMessage = restore(newMessageDelivered, null)

persist({ store: $user, key: 'user' })
persist({ store: $message, key: 'message' })
persist({ store: $messages, key: 'messages' })

sample({
  clock: currentRoute.opened,
  target: [api.getAllMessagesQuery.start, channelSubribeFx],
})

sample({
  clock: currentRoute.closed,
  target: channelUnsubribeFx,
})

sample({
  clock: api.getAllMessagesQuery.$succeeded,
  source: api.getAllMessagesQuery.$data,
  fn: (messages) => messages ?? [],
  target: $messages,
})

sample({
  clock: usernameFormSubmitted,
  source: $username,
  fn: (username) => {
    if (username.trim().length === 0) return 'empty'
    return null
  },
  target: $usernameError,
})

sample({
  clock: usernameFormSubmitted,
  source: $username,
  filter: $usernameFormValid,
  target: $user,
})

sample({
  clock: messageFormSubmitted,
  source: $message,
  fn: (message) => {
    if (message.trim().length === 0) return 'empty'
    return null
  },
  target: $messageError,
})

sample({
  clock: messageFormSubmitted,
  source: { message: $message, user: $user },
  filter: $messageFormValid,
  fn: ({ message, user }) => ({ user, body: message }) as MessageParams,
  target: api.sendMessageMutation.start,
})

sample({
  clock: api.sendMessageMutation.$finished,
  target: clearMessage,
})

sample({
  clock: newMessageDelivered,
  source: { message: $newMessage, messages: $messages },
  fn: ({ message, messages }) => {
    if (message !== null) return messages.concat(message)
    return messages
  },
  target: $messages,
})

reset({
  clock: clearMessage,
  target: $message,
})

reset({
  clock: userLoggedOut,
  target: [$username, $usernameError, $message, $messageError, $user],
})
