'use client'

import Image from 'next/image'
import styles from './Avatar.module.css'

function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function Avatar({ user, size = 32, className = '' }) {
  const style = {
    width: size,
    height: size,
    fontSize: size * 0.38,
    minWidth: size,
  }

  if (user?.avatar) {
    return (
      <div
        className={`${styles.avatar} ${className}`}
        style={style}
        title={user.fullName}
      >
        <Image
          src={user.avatar}
          alt={user.fullName || 'User'}
          width={size}
          height={size}
          className={styles.img}
        />
      </div>
    )
  }

  return (
    <div
      className={`${styles.avatar} ${styles.initials} ${className}`}
      style={style}
      title={user?.fullName}
    >
      {getInitials(user?.fullName)}
    </div>
  )
}
