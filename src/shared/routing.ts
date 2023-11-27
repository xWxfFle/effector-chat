import {
  createHistoryRouter,
  createRoute,
  createRouterControls,
} from 'atomic-router'
import { sample } from 'effector'
import { createBrowserHistory } from 'history'
import { appStarted } from './config/init'

export const routes = {
  chat: createRoute(),
}

export const controls = createRouterControls()

export const router = createHistoryRouter({
  routes: [
    {
      path: '/',
      route: routes.chat,
    },
  ],
  controls,
})

sample({
  clock: appStarted,
  fn: () => createBrowserHistory(),
  target: router.setHistory,
})
