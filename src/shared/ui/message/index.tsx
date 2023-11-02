import { Paper, Text } from '@mantine/core'

interface Props {
  title: string
  body: string
}

export const Message = ({ title, body }: Props) => {
  return (
    <Paper shadow="xs" radius="xl" p="md">
      <Text fw={500} size="sm" c="blue">
        {title}
      </Text>
      <Text>{body}</Text>
    </Paper>
  )
}
