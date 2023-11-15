import {
  ActionIcon,
  AppShell,
  Button,
  Container,
  Paper,
  rem,
  Stack,
  Text,
  TextInput,
  TextInputProps,
  useMantineTheme,
} from '@mantine/core'
import { Message } from '@shared/ui'
import { IconArrowRight, IconLogout } from '@tabler/icons-react'
import { useUnit } from 'effector-react'
import { FormEventHandler, useState } from 'react'
import {
  $message,
  $user,
  $username,
  $usernameError,
  messageChanged,
  userLoggedOut,
  usernameChanged,
  usernameFormSubmitted,
} from './model'
import styles from './styles.module.css'

const MessageInput = (props: TextInputProps) => {
  const theme = useMantineTheme()
  const [message, user] = useUnit([$message, $user])

  return (
    <TextInput
      size="md"
      disabled={!user}
      value={message}
      p="sm"
      onChange={(event) => messageChanged(event.currentTarget.value)}
      placeholder="Написать сообщение..."
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
  const [username, error] = useUnit([$username, $usernameError])
  const floating = username.trim().length > 0 || focused || undefined
  const onFormSubmit: FormEventHandler = (e) => {
    e.preventDefault()
    usernameFormSubmitted()
  }
  console.log('error', error)

  return (
    <Paper
      component="form"
      onSubmit={onFormSubmit}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 'var(--mantine-spacing-xs)',
      }}
    >
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
      <Button type="submit">Сохранить</Button>
    </Paper>
  )
}

const Header = () => {
  const [user] = useUnit([$user])
  const icon = <IconLogout size={16} />

  if (!user) return <UsernameInput />

  return (
    <Container
      fluid
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 'var(--mantine-spacing-xs)',
      }}
    >
      <Text size="lg">{user}</Text>
      <Button leftSection={icon} onClick={() => userLoggedOut()}>
        Выйти
      </Button>
    </Container>
  )
}

export const Chat = () => {
  return (
    <AppShell
      padding="md"
      layout="alt"
      header={{ height: 77 }}
      footer={{ height: 66 }}
      navbar={{ width: 200, breakpoint: 'md', collapsed: { mobile: true } }}
      bg="var(--mantine-color-gray-1)"
    >
      <AppShell.Header
        style={{
          display: 'flex',
          padding: 'var(--mantine-spacing-md)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Header />
      </AppShell.Header>
      <AppShell.Navbar />
      <AppShell.Main style={{ display: 'flex', alignItems: 'flex-end' }}>
        <Stack
          justify="flex-end"
          maw={700}
          style={{ overflowY: 'auto' }}
          gap="xs"
          py="xs"
        >
          <Message
            title="Arseniy"
            body="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam."
          />
        </Stack>
      </AppShell.Main>
      <AppShell.Footer>
        <MessageInput />
      </AppShell.Footer>
    </AppShell>
  )
}
