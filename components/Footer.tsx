import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="section-wrap py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* 브랜드 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-hero-gradient flex items-center justify-center">
                <span className="text-white font-black text-base">R</span>
              </div>
              <div>
                <span className="font-black text-white text-lg">바로세움</span>
                <span className="ml-1 text-xs font-semibold text-accent-400 tracking-widest uppercase">RAISEUP</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-neutral-400">
              SO멘토링연구소가 개발한 AI 기반<br />
              학생 성장 진단·코칭 플랫폼
            </p>
            <p className="text-xs text-neutral-500">
              바로세움 6단계: Raise · Build · Dialogue · Write · Reflect · Act
            </p>
          </div>

          {/* 메뉴 */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">서비스</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: '/diagnosis', label: '성장 진단 (AI 적합도 분석)' },
                { href: '/discussion', label: '어울림토론 AI' },
                { href: '/self-management', label: '자기경영 시스템' },
                { href: '/parent-coaching', label: '학부모 코칭' },
                { href: '/consultation', label: '상담 문의' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors duration-150">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">SO멘토링연구소</h4>
            <ul className="space-y-2.5 text-sm text-neutral-400">
              <li>📍 경기도 부천시</li>
              <li>📞 문의는 상담 신청을 이용해주세요</li>
              <li>🏫 어울림토론 운영 2021년~ (부천 지역)</li>
              <li>
                <Link href="/consultation" className="mt-2 inline-flex btn-accent text-xs px-4 py-2">
                  무료 상담 신청 →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
          <span>© 2026 SO멘토링연구소. All rights reserved.</span>
          <span>바로세움 RAISEUP — AI Growth Platform</span>
        </div>
      </div>
    </footer>
  )
}
