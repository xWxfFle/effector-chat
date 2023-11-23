import {
  ActionIcon,
  Affix,
  AppShell,
  Button,
  Input,
  Paper,
  rem,
  Stack,
  Text,
  TextInput,
  TextInputProps,
  Transition,
  useMantineTheme,
} from '@mantine/core'
import { useWindowScroll } from '@mantine/hooks'
import { MessageCard } from '@shared/ui'
import {
  IconArrowDown,
  IconArrowUp,
  IconChevronDown,
  IconKeyboard,
  IconLogout,
} from '@tabler/icons-react'
import { useUnit } from 'effector-react'
import { FormEventHandler, useRef } from 'react'
import {
  $message,
  $messages,
  $user,
  $username,
  messageChanged,
  messageFormSubmitted,
  userLoggedOut,
  usernameChanged,
  usernameFormSubmitted,
} from './model'

const MessageInput = (props: TextInputProps) => {
  const theme = useMantineTheme()
  const [message, user] = useUnit([$message, $user])
  const onFormSubmit: FormEventHandler = (event) => {
    event.preventDefault()
    messageFormSubmitted()
  }

  return (
    <Paper component="form" onSubmit={onFormSubmit} w="100%">
      <TextInput
        size="md"
        disabled={!user}
        value={message}
        p="sm"
        maxLength={1024}
        onSubmit={onFormSubmit}
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
        leftSectionWidth={42}
        rightSectionWidth={42}
        rightSection={
          <ActionIcon
            size={32}
            radius="xl"
            type="submit"
            color={theme.primaryColor}
            variant="filled"
          >
            <IconArrowUp
              style={{ width: rem(18), height: rem(18) }}
              stroke={1.5}
            />
          </ActionIcon>
        }
        {...props}
      />
    </Paper>
  )
}

const UsernameInput = () => {
  const [username] = useUnit([$username])
  const onFormSubmit: FormEventHandler = (event) => {
    event.preventDefault()
    usernameFormSubmitted()
  }

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
      <Button
        leftSection={<IconLogout size={16} />}
        onClick={() => userLoggedOut()}
        size="md"
      >
        Выйти
      </Button>
    </Paper>
  )
}

export const Chat = () => {
  const [messages] = useUnit([$messages])
  const [scroll, scrollTo] = useWindowScroll()
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
          style={{ overflowY: 'auto' }}
          gap="xs"
          py="xs"
        >
          {messages.map((message) => (
            <MessageCard key={crypto.randomUUID()} message={message} />
          ))}
        </Stack>
        <Affix position={{ bottom: 78, right: 12 }}>
          <Transition
            transition="slide-up"
            mounted={
              scroll.y < document.body.scrollHeight - window.innerHeight - 200
            }
          >
            {(transitionStyles) => (
              <ActionIcon
                size="xl"
                radius="xl"
                style={transitionStyles}
                onClick={() => scrollTo({ y: document.body.scrollHeight })}
                variant="light"
              >
                <IconChevronDown style={{ width: rem(32), height: rem(32) }} />
              </ActionIcon>
            )}
          </Transition>
        </Affix>
      </AppShell.Main>
      <AppShell.Footer>
        <MessageInput />
      </AppShell.Footer>
    </AppShell>
  )
}
