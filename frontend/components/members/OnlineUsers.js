'use client'

import useWebsocketStore from '../../stores/websocketStore'
import Avatar from '../ui/Avatar'
import styles from './OnlineUsers.module.css'

export default function OnlineUsers({ projectId, members = [] }) {
  const { onlineUsers } = useWebsocketStore()
  const onlineIds = onlineUsers[projectId] || []

  const onlineMembers = members.filter((m) =>
    onlineIds.includes(m._id)
  )

  if (onlineMembers.length === 0) return null

  return (
    <div className={styles.container}>
      <div className={styles.dot} />
      <span className={styles.label}>Online</span>
      <div className={styles.avatars}>
        {onlineMembers.map((member) => (
          <div key={member._id} className={styles.avatarWrap} title={member.fullName}>
            <Avatar user={member} size={28} />
            <span className={styles.onlineDot} />
          </div>
        ))}
      </div>
      <span className={styles.count}>
        {onlineMembers.length} online
      </span>
    </div>
  )
}
