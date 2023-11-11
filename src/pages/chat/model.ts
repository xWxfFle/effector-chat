import { createEvent, createStore } from 'effector'

export const usernameChanged = createEvent<string>()
export const messageChanged = createEvent<string>()

export const messageFormSubmitted = createEvent()
export const usernameFormSubmitted = createEvent()

export const $username = createStore('')
export const $usernameError = createStore('')

export const $message = createStore('')
export const $messageError = createStore('')

export const $messages = createStore<string[]>([])

$username.on(usernameChanged, (_, username) => username)

$message.on(messageChanged, (_, message) => message)
