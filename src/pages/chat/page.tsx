import {
  ActionIcon,
  AppShell,
  Button,
  Input,
  Paper,
  rem,
  Stack,
  Text,
  TextInput,
  TextInputProps,
  useMantineTheme,
} from '@mantine/core'
import { Message } from '@shared/ui'
import { IconArrowRight, IconKeyboard, IconLogout } from '@tabler/icons-react'
import { useUnit } from 'effector-react'
import { FormEventHandler } from 'react'
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
      placeholder={
        user ? 'Написать сообщение...' : 'Введите имя, чтобы начать общение'
      }
      leftSection={
        <IconKeyboard
          style={{ width: rem(18), height: rem(18) }}
          stroke={1.5}
        />
      }
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
  const [username, error] = useUnit([$username, $usernameError])
  const onFormSubmit: FormEventHandler = (e) => {
    e.preventDefault()
    usernameFormSubmitted()
  }
  console.log('error', error)

  return (
    <Paper
      component="form"
      onSubmit={onFormSubmit}
      p="sm"
      w="100%"
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 'var(--mantine-spacing-xs)',
      }}
    >
      <Input
        placeholder="Ваше имя..."
        maxLength={24}
        required
        style={{ flex: 1 }}
        value={username}
        onChange={(event) => usernameChanged(event.currentTarget.value)}
        size="md"
        autoComplete="nope"
      />
      <Button type="submit" size="md">
        Сохранить
      </Button>
    </Paper>
  )
}

const Header = () => {
  const theme = useMantineTheme()

  const [user] = useUnit([$user])
  const icon = <IconLogout size={16} />

  if (!user) return <UsernameInput />

  return (
    <Paper
      p="sm"
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        gap: 'var(--mantine-spacing-xs)',
      }}
    >
      <Text size="lg" fw={500} c={theme.primaryColor}>
        {user}
      </Text>
      <Button leftSection={icon} onClick={() => userLoggedOut()} size="md">
        Выйти
      </Button>
    </Paper>
  )
}

export const Chat = () => {
  return (
    <AppShell
      padding="md"
      layout="alt"
      header={{ height: 66 }}
      footer={{ height: 66 }}
      navbar={{ width: 250, breakpoint: 'md', collapsed: { mobile: true } }}
      bg="var(--mantine-color-gray-1)"
    >
      <AppShell.Header
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
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
