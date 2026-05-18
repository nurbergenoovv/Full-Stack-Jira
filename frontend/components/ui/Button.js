'use client'

import styles from './Button.module.css'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className}`}
      {...props}
    >
      {loading ? <span className={styles.spinner} /> : children}
    </button>
  )
}
