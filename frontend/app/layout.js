import './globals.css'
import AppInitializer from './AppInitializer'

export const metadata = {
  title: 'Jira — Project Management',
  description: 'A Jira/Trello-like project management platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppInitializer />
        {children}
      </body>
    </html>
  )
}
