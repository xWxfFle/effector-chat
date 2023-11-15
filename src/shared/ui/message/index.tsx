import { Paper, Text, useMantineTheme } from '@mantine/core'

interface Props {
  title: string
  body: string
}

export const Message = ({ title, body }: Props) => {
  const theme = useMantineTheme()

  return (
    <Paper
      shadow="xs"
      radius="xl"
      p="xs"
      pl="md"
      style={{ wordBreak: 'break-word' }}
    >
      <Text fw={500} size="sm" c={theme.primaryColor}>
        {title}
      </Text>
      <Text>{body}</Text>
    </Paper>
  )
}
