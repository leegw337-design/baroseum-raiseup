import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: '바로세움 RAISEUP | SO멘토링연구소',
  description: 'AI 기반 학생 성장 진단 및 코칭 플랫폼 — 바로세움 RAISEUP',
  keywords: ['바로세움', 'RAISEUP', 'SO멘토링연구소', '자기주도학습', '어울림토론', 'AI 교육'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
