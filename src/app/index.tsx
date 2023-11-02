import { FloatingLabelInput, InputWithButton, Message } from '@shared/ui'
import styles from './styles.module.css'

export const App = () => {
  return (
    <div className={styles.container}>
      <div className={styles.page}>
        <Message title="Hello" body="World" />
        <FloatingLabelInput />
        <InputWithButton />
      </div>
    </div>
  )
}
