import {
  ActionIcon,
  rem,
  TextInput,
  TextInputProps,
  useMantineTheme,
} from '@mantine/core'
import { Message } from '@shared/ui'
import { IconArrowRight } from '@tabler/icons-react'
import { useUnit } from 'effector-react'
import { useState } from 'react'
import { $message, $username, messageChanged, usernameChanged } from './model'
import styles from './styles.module.css'

const MessageInput = (props: TextInputProps) => {
  const theme = useMantineTheme()
  const [message] = useUnit([$message])

  return (
    <TextInput
      radius="xl"
      size="md"
      value={message}
      onChange={(event) => messageChanged(event.currentTarget.value)}
      placeholder="Введите сообщение"
      rightSectionWidth={42}
      rightSection={
        <ActionIcon
          size={32}
          radius="xl"
          color={theme.primaryColor}
          variant="filled"
        >
          <IconArrowRight
            style={{ width: rem(18), height: rem(18) }}
            stroke={1.5}
          />
        </ActionIcon>
      }
      {...props}
    />
  )
}

const UsernameInput = () => {
  const [focused, setFocused] = useState(false)
  const [username] = useUnit([$username])
  const floating = username.trim().length > 0 || focused || undefined

  return (
    <TextInput
      label="Введите ваше имя"
      placeholder="Фёдор Двинятин"
      required
      classNames={styles}
      value={username}
      onChange={(event) => usernameChanged(event.currentTarget.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      mt="md"
      autoComplete="nope"
      data-floating={floating}
      labelProps={{ 'data-floating': floating }}
    />
  )
}

export const Chat = () => {
  return (
    <div className={styles.container}>
      <div className={styles.page}>
        <Message
          title="Arseniy"
          body="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam"
        />
        <UsernameInput />
        <MessageInput />
      </div>
    </div>
  )
}
