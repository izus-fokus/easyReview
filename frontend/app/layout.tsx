import './globals.css'
import Header from '@/app/review/[id]/components/header'

export const metadata = {
  title: 'EasyReview',
  description: 'Web-based tool for reviewing datasets',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dracula">
      <body
        // className="z-0 h-screen bg-gradient-to-r from-base-300 via-base-200 to-base-300"
        className="bg-[url('../public/pattern.svg')]"
      >
        <main>
          {children}
        </main>
      </body>
    </html >
  )
}
