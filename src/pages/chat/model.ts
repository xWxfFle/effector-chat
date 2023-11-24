import { Message } from '@shared/api'
import { createEvent, createStore, restore, sample } from 'effector'
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
export const $messageFormValid = not(or(empty($user), $messageError))
export const $usernameFormValid = not($usernameError)

export const userLoggedOut = createEvent()
export const clearMessage = createEvent()
export const messageFormSubmitted = createEvent()
export const usernameFormSubmitted = createEvent()

persist({ store: $user, key: 'user' })
persist({ store: $message, key: 'message' })
persist({ store: $messages, key: 'messages' })

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
  source: { message: $message, messages: $messages, user: $user },
  filter: $messageFormValid,
  fn: ({ message, messages, user }) => {
    if (!message || !user) return messages
    return messages.concat({ user, body: message })
  },
  target: [$messages, clearMessage],
})

reset({
  clock: clearMessage,
  target: $message,
})

reset({
  clock: userLoggedOut,
  target: [$username, $usernameError, $message, $messageError, $user],
})
