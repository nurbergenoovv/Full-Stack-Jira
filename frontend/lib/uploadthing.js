import { generateUploadButton, generateUploadDropzone } from '@uploadthing/react'

const url =
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api') +
  '/uploadthing'

export const UploadButton = generateUploadButton({ url })
export const UploadDropzone = generateUploadDropzone({ url })
