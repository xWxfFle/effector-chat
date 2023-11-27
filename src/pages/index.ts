import { PageLoader } from '@shared/ui'
import { createRoutesView } from 'atomic-router-react'
import { ChatRoute } from './chat'

export const Pages = createRoutesView({
  routes: [ChatRoute],
  otherwise: PageLoader,
})
