import { ActionIcon, Group, useMantineColorScheme } from '@mantine/core'
import { cn } from '@shared/lib/clsx'
import { IconMoon, IconSun } from '@tabler/icons-react'
import classes from './index.module.css'

export const ToggleTheme = () => {
  const { toggleColorScheme } = useMantineColorScheme()

  return (
    <Group justify="center">
      <ActionIcon
        onClick={toggleColorScheme}
        variant="default"
        size="xl"
        aria-label="Toggle color scheme"
      >
        <IconSun className={cn(classes.icon, classes.light)} stroke={1.5} />
        <IconMoon className={cn(classes.icon, classes.dark)} stroke={1.5} />
      </ActionIcon>
    </Group>
  )
}
