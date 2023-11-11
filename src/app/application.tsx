import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import { Chat } from '@pages/chat'

export const App = () => {
  return (
    <MantineProvider>
      <Chat />
    </MantineProvider>
  )
}
