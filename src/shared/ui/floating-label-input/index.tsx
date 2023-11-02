import { TextInput } from '@mantine/core'
import { useState } from 'react'
import classes from './styles.module.css'

export const FloatingLabelInput = () => {
  const [focused, setFocused] = useState(false)
  const [value, setValue] = useState('')
  const floating = value.trim().length > 0 || focused || undefined

  return (
    <TextInput
      label="Введите ваше имя"
      placeholder="Фёдор Двенятин"
      required
      classNames={classes}
      value={value}
      onChange={(event) => setValue(event.currentTarget.value)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      mt="md"
      autoComplete="nope"
      data-floating={floating}
      labelProps={{ 'data-floating': floating }}
    />
  )
}
