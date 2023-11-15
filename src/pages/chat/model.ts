import { createEvent, createStore, sample } from 'effector'
import persist from 'effector-localstorage'
import { reset } from 'patronum'

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

export const $user = createStore<string>('')

export const userLoggedOut = createEvent()
export const messageFormSubmitted = createEvent()
export const usernameFormSubmitted = createEvent()

reset({
  clock: [userLoggedOut],
  target: [$username, $usernameError, $message, $messageError, $user],
})

$username.on(usernameChanged, (_, username) => username)
$message.on(messageChanged, (_, message) => message)

persist({ store: $user, key: 'user' })
persist({ store: $message, key: 'message' })

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
  filter: $usernameError.map((e) => !e),
  target: $user,
})

sample({
  clock: messageFormSubmitted,
  source: $message,
  fn: (message) => {
    if (message.trim().length === 0) return 'empty'
    return null
  },
  filter: $user.map((user) => Boolean(user)),
  target: $messageError,
})
