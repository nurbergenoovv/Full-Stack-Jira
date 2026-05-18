'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import useProjectStore from '../../stores/projectStore'
import useAuthStore from '../../stores/authStore'
import Avatar from '../ui/Avatar'
import Button from '../ui/Button'
import styles from '../../styles/dashboard.module.css'

export default function ProjectCard({ project }) {
  const router = useRouter()
  const { deleteProject } = useProjectStore()
  const { user } = useAuthStore()

  const isOwner = project.owner?._id === user?._id || project.owner === user?._id

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!confirm(`Delete project "${project.title}"? This cannot be undone.`)) return
    try {
      await deleteProject(project._id)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div
      className={styles.projectCard}
      onClick={() => router.push(`/projects/${project._id}`)}
    >
      <div className={styles.cardCover}>
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className={styles.cardCoverFallback}>
            {project.title?.charAt(0)?.toUpperCase()}
          </div>
        )}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardTop}>
          <h3 className={styles.cardTitle}>{project.title}</h3>
          {isOwner && (
            <button
              className={styles.deleteBtn}
              onClick={handleDelete}
              title="Delete project"
            >
              &#x2715;
            </button>
          )}
        </div>

        {project.description && (
          <p className={styles.cardDesc}>{project.description}</p>
        )}

        <div className={styles.cardFooter}>
          <div className={styles.members}>
            {project.members?.slice(0, 4).map((member) => (
              <div key={member._id || member} className={styles.memberAvatar}>
                <Avatar user={typeof member === 'object' ? member : null} size={24} />
              </div>
            ))}
            {project.members?.length > 4 && (
              <span className={styles.moreMembers}>+{project.members.length - 4}</span>
            )}
          </div>
          <span className={styles.cardStatus}>{project.status || 'active'}</span>
        </div>
      </div>
    </div>
  )
}
