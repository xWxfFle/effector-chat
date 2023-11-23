import { ActionIcon, Group, useMantineColorScheme } from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'
import cx from 'clsx'
import classes from './index.module.css'

export const ToggleTheme = () => {
  const { toggleColorScheme } = useMantineColorScheme()

  return (
    <Group justify="center">
      <ActionIcon
        onClick={() => toggleColorScheme()}
        variant="default"
        size="xl"
        aria-label="Toggle color scheme"
      >
        <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
        <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
      </ActionIcon>
    </Group>
  )
}
