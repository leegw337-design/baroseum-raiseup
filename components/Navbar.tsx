'use client'
import Link from 'next/link'
import { useState } from 'react'

const navLinks = [
  { href: '/diagnosis', label: '성장 진단' },
  { href: '/diagnosis/records', label: '진단 결과' },
  { href: '/self-management', label: '자기경영' },
  { href: '/discussion', label: '어울림토론 AI' },
  { href: '/parent-coaching', label: '학부모 코칭' },
  { href: '/consultation', label: '상담 문의' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-nav border-b border-neutral-100">
      <div className="section-wrap">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-hero-gradient flex items-center justify-center shadow-card group-hover:shadow-card-hover transition-all">
              <span className="text-white font-black text-base leading-none">R</span>
            </div>
            <div className="leading-tight">
              <span className="font-black text-primary-800 text-lg tracking-tight">바로세움</span>
              <span className="ml-1 text-xs font-semibold text-accent-500 tracking-widest uppercase">RAISEUP</span>
            </div>
          </Link>

          {/* 데스크탑 메뉴 */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-600
                           hover:text-primary-600 hover:bg-primary-50 transition-all duration-150"
              >
                {l.label.includes(' AI')
                  ? <>{l.label.replace(' AI', '')}<span className="text-accent-500 font-bold"> AI</span></>
                  : l.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/diagnosis" className="btn-accent text-sm px-5 py-2.5">
              무료 진단 시작
            </Link>
          </div>

          {/* 모바일 햄버거 */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition"
            onClick={() => setOpen(!open)}
            aria-label="메뉴"
          >
            <svg className="w-6 h-6 text-neutral-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* 모바일 드롭다운 */}
        {open && (
          <div className="md:hidden border-t border-neutral-100 py-3 space-y-1 animate-slide-in">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-medium text-neutral-700
                           hover:bg-primary-50 hover:text-primary-600 transition"
              >
                {l.label.includes(' AI')
                  ? <>{l.label.replace(' AI', '')}<span className="text-accent-500 font-bold"> AI</span></>
                  : l.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link href="/diagnosis" onClick={() => setOpen(false)} className="btn-accent w-full text-sm py-3">
                무료 진단 시작
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
