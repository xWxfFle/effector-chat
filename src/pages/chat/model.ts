import { Message } from '@shared/api'
import { createEvent, createStore, sample } from 'effector'
import persist from 'effector-localstorage'
import { and, empty, not, reset } from 'patronum'

export const createField = <Value, Error>(defaultValue: Value) => {
  const $value = createStore(defaultValue)
  const $error = createStore<Error | null>(null)
  const $set = createEvent<string>()
  return [$value, $set, $error] as const
}

export const [$username, usernameChanged, $usernameError] = createField<
  string,
  null | 'empty'
>('')

export const [$message, messageChanged, $messageError] = createField<
  string,
  null | 'empty'
>('')
export const $user = createStore<string | null>(null)
export const $messages = createStore<Message[]>([])

export const userLoggedOut = createEvent()
export const clearMessage = createEvent()
export const messageFormSubmitted = createEvent()
export const usernameFormSubmitted = createEvent()

$username.on(usernameChanged, (_, username) => username)
$message.on(messageChanged, (_, message) => message)

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
  fn: (username) => username,
  filter: not($usernameError),
  target: $user,
})

sample({
  clock: messageFormSubmitted,
  source: $message,
  fn: (message) => {
    if (message.trim().length === 0) return 'empty'
    return null
  },
  filter: not(empty($user)),
  target: $messageError,
})

sample({
  clock: messageFormSubmitted,
  source: { message: $message, messages: $messages, user: $user },
  fn: ({ message, messages, user }) => {
    if (!message || !user) return messages
    return messages.concat({ user, body: message })
  },
  filter: and(not(empty($user)), not($messageError)),
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
