import styles from './DialogBox.module.css'

export default function DialogBox({ message, onDismiss, children }) {
  return (
    <div className={styles.wrapper} onClick={onDismiss} style={{ cursor: onDismiss ? 'pointer' : 'default' }}>
      <div className={styles.box}>
        <p className={styles.message}>"{message}"</p>
        {onDismiss && !children && <p className={styles.hint}>clique para continuar...</p>}
        {children && <div onClick={e => e.stopPropagation()}>{children}</div>}
      </div>
    </div>
  )
}
