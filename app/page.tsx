'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

/* ─── 점수 바 데이터 ─── */
const scoreItems = [
  { label: 'AI 활용 적합성', score: 30, color: 'bg-primary-500', delay: '0ms' },
  { label: '성장 가능성',    score: 40, color: 'bg-accent-500',   delay: '150ms' },
  { label: '참여 역량',      score: 30, color: 'bg-primary-400',  delay: '300ms' },
]

/* ─── 6단계 모듈 ─── */
const raiseupSteps = [
  { step: '01', key: 'Raise',    label: '발굴',   desc: '잠재 역량을 발굴하고 가능성을 확인합니다', color: 'from-primary-800 to-primary-600', icon: '🌱' },
  { step: '02', key: 'Build',    label: '구축',   desc: '자기경영·학습 습관을 체계적으로 구축합니다', color: 'from-primary-700 to-primary-500', icon: '🏗️' },
  { step: '03', key: 'Dialogue', label: '대화',   desc: '어울림토론으로 논리적 사고력을 키웁니다', color: 'from-primary-600 to-primary-400', icon: '💬' },
  { step: '04', key: 'Write',    label: '글쓰기', desc: '논리적·감성적 글쓰기 역량을 개발합니다', color: 'from-accent-700 to-accent-500',   icon: '✍️' },
  { step: '05', key: 'Reflect',  label: '성찰',   desc: '성장 과정을 돌아보고 메타인지를 높입니다', color: 'from-accent-600 to-accent-400',   icon: '🪞' },
  { step: '06', key: 'Act',      label: '실행',   desc: '학습·경험을 실생활에 적용하고 실천합니다', color: 'from-primary-500 to-accent-500',   icon: '🚀' },
]

/* ─── Growth AI 모듈 카드 ─── */
const modules = [
  { href: '/self-management', icon: '📋', title: '자기경영',     desc: '아이젠하워 매트릭스로 시간·목표를 관리합니다', badge: '완료', badgeColor: 'badge-primary' },
  { href: '/discussion',      icon: '🗣️', title: '어울림토론 AI', desc: 'AI와 함께 6단계 토론 역량을 키웁니다',         badge: '완료', badgeColor: 'badge-primary' },
  { href: '#',                icon: '📚', title: '학습 코칭',    desc: '6교과 맞춤 학습 에이전트 (준비 중)',            badge: 'Phase 2', badgeColor: 'badge-accent' },
  { href: '#',                icon: '✈️', title: '체험활동 AI',  desc: '국내외 캠프·여행 큐레이션 (준비 중)',           badge: 'Phase 2', badgeColor: 'badge-accent' },
]

/* ─── 레벨 기준 ─── */
const levels = [
  { level: 'Excellence', range: '85점 이상', color: 'bg-primary-500', text: '최적 적합 — 즉시 시작 권장' },
  { level: 'Suitable',   range: '70~84점',  color: 'bg-primary-400', text: '적합 — 바로 시작 권장' },
  { level: 'Basic',      range: '55~69점',  color: 'bg-accent-400',  text: '기초 역량 개발 필요' },
  { level: 'Exploring',  range: '54점 이하', color: 'bg-neutral-400', text: '탐색 단계 — 상담 우선' },
]

/* ─── SO멘토링연구소 실적 지표 ─── */
const stats = [
  { value: '13년', label: '교육 전문 경력', icon: '🏛️' },
  { value: '70회+', label: '청소년 캠프 운영', icon: '⛺' },
  { value: '2021~', label: '부천 어울림토론', icon: '🗣️' },
  { value: '500명+', label: '성장 지원 학생', icon: '🌱' },
]

/* ─── 프로그램 특징 ─── */
const features = [
  {
    icon: '🧠',
    title: '어울림토론 프로그램',
    desc: '2021년부터 부천을 중심으로 운영 중인 SO멘토링연구소의 핵심 프로그램입니다. 6단계 RAISEUP 모델을 기반으로 청소년의 논리적 사고력과 의사소통 역량을 체계적으로 키웁니다.',
    highlight: '2021~ 부천 운영',
  },
  {
    icon: '⛺',
    title: '청소년 성장 캠프',
    desc: '13년간 70회 이상 운영한 체험 중심 성장 프로그램입니다. 국내외 캠프를 통해 실제 경험과 도전 속에서 자기 발견과 리더십을 키웁니다.',
    highlight: '70회+ 운영 실적',
  },
  {
    icon: '🤖',
    title: 'AI 융합 교육',
    desc: 'AI 도구를 교육 현장에 접목하여 개인 맞춤형 학습 경험을 제공합니다. BGA(뇌기능분석)·뇌파검사와 연계하여 과학적 진단을 기반으로 성장을 설계합니다.',
    highlight: 'BGA·뇌파검사 연계',
  },
]

/* ─── 학부모 후기 ─── */
const testimonials = [
  {
    text: '어울림토론 프로그램을 통해 아이가 자신의 생각을 논리적으로 표현하게 되었어요. 토론이 두렵다던 아이가 이제는 적극적으로 의견을 내고 있습니다.',
    name: '부천 초등 5학년 학부모',
    tag: '어울림토론',
  },
  {
    text: 'SO멘토링연구소 캠프에서 아이가 정말 많이 성장했어요. 자기주도적으로 목표를 세우고 실천하는 모습이 놀라웠습니다. AI 성장 진단도 정확하더라고요.',
    name: '인천 중학교 2학년 학부모',
    tag: '성장 캠프',
  },
  {
    text: '13년 경력의 전문가답게 아이의 강점과 약점을 정확히 짚어주셨어요. 뇌파검사 기반 맞춤 상담이 특히 유익했습니다. 계속 함께하고 싶은 기관입니다.',
    name: '서울 초등 6학년 학부모',
    tag: 'BGA 상담',
  },
]

/* ─── 애니메이션 점수 바 ─── */
function AnimatedScoreBar({ label, score, color, delay }: { label: string; score: number; color: string; delay: string }) {
  const [filled, setFilled] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setFilled(true) }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-semibold text-neutral-700">{label}</span>
        <span className="text-sm font-bold text-primary-600">{score}점</span>
      </div>
      <div className="score-bar-track">
        <div
          className={`score-bar-fill ${color} transition-all ease-out`}
          style={{
            width: filled ? `${score}%` : '0%',
            transitionDuration: '1.2s',
            transitionDelay: delay,
          }}
        />
      </div>
    </div>
  )
}

/* ─── 카운트업 숫자 ─── */
function CountUp({ value }: { value: string }) {
  return <span className="text-3xl md:text-4xl font-black text-white">{value}</span>
}

export default function HomePage() {
  return (
    <div className="bg-neutral-50">

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative overflow-hidden bg-hero-gradient text-white pt-20 pb-28 md:pt-28 md:pb-36">
        {/* 배경 장식 */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-400/20 blur-3xl" />
          <div className="absolute bottom-0 -left-16 w-80 h-80 rounded-full bg-accent-500/15 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
        </div>

        <div className="section-wrap relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 text-sm font-medium backdrop-blur-sm animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
              SO멘토링연구소 · 13년 교육 전문 기관
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-tight animate-slide-up" style={{ animationDelay: '100ms' }}>
              아이의 성장을<br />
              <span className="text-accent-400">SO멘토링연구소가</span> 함께 설계합니다
            </h1>

            <p className="text-lg md:text-xl text-primary-100 leading-relaxed animate-slide-up" style={{ animationDelay: '200ms' }}>
              캠프 70회+, 어울림토론 2021~의 검증된 노하우와<br className="hidden md:block" />
              AI 기술이 만나 아이의 성장을 새롭게 설계합니다
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <Link href="/diagnosis" className="btn-accent text-base px-8 py-4 shadow-accent">
                🎯 무료 성장 진단 시작하기
              </Link>
              <Link href="/consultation" className="btn-outline border-white/40 text-white hover:bg-white/10 text-base px-8 py-4">
                상담 문의하기 →
              </Link>
            </div>
          </div>
        </div>

        {/* 하단 웨이브 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 20C1200 60 720 0 0 40L0 60Z" fill="#F8FAFC" />
          </svg>
        </div>
      </section>

      {/* ══════════════════ 실적 지표 ══════════════════ */}
      <section className="py-14 bg-primary-700">
        <div className="section-wrap">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label} className="space-y-2">
                <div className="text-3xl">{s.icon}</div>
                <CountUp value={s.value} />
                <div className="text-primary-200 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ 점수 배점 구조 ══════════════════ */}
      <section className="py-20">
        <div className="section-wrap">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 텍스트 */}
            <div className="space-y-6">
              <div>
                <span className="badge-primary text-sm mb-3">Diagnosis AI</span>
                <h2 className="section-title mt-2">
                  100점 만점<br />
                  <span className="text-primary-500">AI 적합도 분석</span>
                </h2>
                <p className="section-sub mt-4">
                  학생 8문항 + 학부모 7문항으로 구성된 15문항 진단을 통해
                  3개 영역의 점수를 산출하고 4단계 레벨을 판정합니다.
                </p>
              </div>
              <div className="space-y-4">
                {scoreItems.map((item) => (
                  <AnimatedScoreBar key={item.label} {...item} />
                ))}
              </div>
              <Link href="/diagnosis" className="btn-primary inline-flex">
                지금 진단받기 →
              </Link>
            </div>

            {/* 레벨 카드 */}
            <div className="space-y-3">
              {levels.map((lv) => (
                <div key={lv.level} className="card card-hover p-5 flex items-center gap-4">
                  <div className={`w-2 h-12 rounded-full ${lv.color} flex-shrink-0`} />
                  <div>
                    <div className="flex items-center gap-3 mb-0.5">
                      <span className="font-bold text-neutral-800">{lv.level}</span>
                      <span className="badge-primary text-xs">{lv.range}</span>
                    </div>
                    <p className="text-sm text-neutral-500">{lv.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ SO멘토링연구소 프로그램 ══════════════════ */}
      <section className="py-20 bg-neutral-100">
        <div className="section-wrap">
          <div className="text-center mb-14">
            <span className="badge-primary text-sm mb-3">13년의 교육 전문성</span>
            <h2 className="section-title mt-2">
              검증된 프로그램,<br />
              <span className="text-primary-500">AI로 더 강해졌습니다</span>
            </h2>
            <p className="section-sub">SO멘토링연구소가 13년간 쌓아온 교육 철학이 AI 기술과 만났습니다</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{f.icon}</span>
                  <div>
                    <div className="font-black text-neutral-800 text-base mb-0.5">{f.title}</div>
                    <span className="inline-block text-xs px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-700 font-semibold">{f.highlight}</span>
                  </div>
                </div>
                <p className="text-sm text-neutral-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ RAISEUP 6단계 ══════════════════ */}
      <section className="py-20 bg-neutral-900">
        <div className="section-wrap">
          <div className="text-center mb-14">
            <span className="badge bg-primary-800 text-primary-200 text-sm mb-3">바로세움 교육 철학</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-2">
              RAISEUP <span className="text-accent-400">6단계</span> 성장 모델
            </h2>
            <p className="text-neutral-400 mt-3 text-base">
              SO멘토링연구소가 13년간 개발한 체계적 성장 프레임워크
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {raiseupSteps.map((s) => (
              <div
                key={s.key}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${s.color} p-6 text-white group hover:scale-[1.02] transition-transform duration-200`}
              >
                <div className="absolute top-4 right-4 text-3xl opacity-30 group-hover:opacity-60 transition-opacity">{s.icon}</div>
                <div className="text-xs font-bold text-white/60 tracking-widest mb-2">STEP {s.step}</div>
                <div className="text-2xl font-black mb-1">{s.key}</div>
                <div className="text-lg font-semibold text-white/80 mb-3">— {s.label}</div>
                <p className="text-sm text-white/70 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ Growth AI 모듈 ══════════════════ */}
      <section className="py-20">
        <div className="section-wrap">
          <div className="text-center mb-14">
            <span className="badge-accent text-sm mb-3">Growth AI</span>
            <h2 className="section-title mt-2">학생 성장 운영 시스템</h2>
            <p className="section-sub">4개 하위 엔진이 학생의 전방위 성장을 지원합니다</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {modules.map((m) => (
              <Link
                key={m.title}
                href={m.href}
                className="card card-hover p-6 flex flex-col gap-4 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-2xl group-hover:bg-primary-100 transition">
                  {m.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-bold text-neutral-800 text-base">{m.title}</h3>
                    <span className={`badge text-xs ${m.badgeColor}`}>{m.badge}</span>
                  </div>
                  <p className="text-sm text-neutral-500 leading-relaxed">{m.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ 학부모 후기 ══════════════════ */}
      <section className="py-20 bg-neutral-100">
        <div className="section-wrap">
          <div className="text-center mb-14">
            <span className="badge-primary text-sm mb-3">학부모 후기</span>
            <h2 className="section-title mt-2">직접 경험한 <span className="text-primary-500">성장의 이야기</span></h2>
            <p className="section-sub">SO멘토링연구소와 함께한 학부모님들의 실제 후기입니다</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <div key={i} className="card p-6 flex flex-col gap-4">
                <div className="text-2xl text-primary-300">"</div>
                <p className="text-sm text-neutral-700 leading-relaxed flex-1">{t.text}</p>
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                  <span className="text-xs font-semibold text-neutral-500">{t.name}</span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 font-semibold">{t.tag}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA ══════════════════ */}
      <section className="py-20 bg-hero-gradient text-white">
        <div className="section-wrap text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-black">
            지금 바로 <span className="text-accent-400">무료 진단</span>을 받아보세요
          </h2>
          <p className="text-primary-100 text-lg max-w-xl mx-auto">
            15문항 · 약 5분 소요 · 즉시 결과 확인 · AI 맞춤 프로그램 추천
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/diagnosis" className="btn-accent text-base px-10 py-4 shadow-accent">
              🎯 무료 진단 시작하기
            </Link>
            <Link href="/parent-coaching" className="btn-outline border-white/40 text-white hover:bg-white/10 text-base px-8 py-4">
              학부모 코칭 보기
            </Link>
          </div>
          <p className="text-primary-300 text-sm pt-2">
            📍 부천·인천·서울 · 캠프 70회+ · 어울림토론 2021~ · BGA·뇌파검사 연계
          </p>
        </div>
      </section>

    </div>
  )
}
