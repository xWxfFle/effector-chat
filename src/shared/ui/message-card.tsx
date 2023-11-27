import { Paper, Text, useMantineTheme } from '@mantine/core'
import { Message } from '@shared/api'

interface Props {
  message: Message
}

export const MessageCard = ({ message }: Props) => {
  const theme = useMantineTheme()

  return (
    <Paper
      shadow="xs"
      w="fit-content"
      radius="xl"
      maw={700}
      p="xs"
      px="md"
      style={{ wordBreak: 'break-word' }}
    >
      <Text fw={500} size="sm" c={theme.primaryColor}>
        {message.user}
      </Text>
      <Text>{message.body}</Text>
    </Paper>
  )
}
