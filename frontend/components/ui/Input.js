'use client'

import styles from './Input.module.css'

export default function Input({
  label,
  error,
  type = 'text',
  className = '',
  ...props
}) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        type={type}
        className={`${styles.input} ${error ? styles.inputError : ''}`}
        {...props}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}
