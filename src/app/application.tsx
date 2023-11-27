import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import { Pages } from '@pages'
import { router } from '@shared/routing'
import { RouterProvider } from 'atomic-router-react'

export const App = () => {
  return (
    <MantineProvider>
      <RouterProvider router={router}>
        <Pages />
      </RouterProvider>
    </MantineProvider>
  )
}
