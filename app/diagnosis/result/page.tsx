'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

/* ─── 레벨 정의 ─── */
const levelMap = {
  Excellence: {
    label: 'Excellence',
    color: 'from-primary-600 to-primary-400',
    textColor: 'text-primary-600',
    bgColor: 'bg-primary-50',
    borderColor: 'border-primary-200',
    desc: 'AI 프로그램 최적 적합 상태입니다. 즉시 시작을 권장합니다.',
    icon: '🏆',
    tagline: '탁월한 준비 상태',
    strengths: [
      '학습 동기와 자기주도성이 매우 높아 AI 기반 학습에 최적화되어 있습니다.',
      '논리적 사고력과 문제 해결 능력이 이미 탄탄하게 갖춰져 있습니다.',
      '학부모의 교육 철학과 연구소 프로그램의 방향이 높은 일치도를 보입니다.',
      'AI 도구 활용에 대한 개방성과 적응력이 탁월합니다.',
    ],
    improvements: [
      '이미 높은 역량을 더욱 심화시킬 고급 과정 참여를 권장합니다.',
      '학습 성과를 체계적으로 기록·포트폴리오화하는 습관을 형성하세요.',
    ],
    recommendation: '즉시 어울림토론 AI와 자기경영 시스템을 동시에 시작하고, BGA·뇌파검사 연계 정밀 진단을 통해 개인 맞춤 성장 로드맵을 설계하실 것을 강력히 추천합니다.',
    programs: [
      { href: '/self-management', icon: '📋', title: '자기경영 시스템', desc: '즉시 시작 · 아이젠하워 매트릭스로 목표를 설계하세요', priority: '최우선' },
      { href: '/discussion',      icon: '🗣️', title: '어울림토론 AI',  desc: '즉시 시작 · 6단계 토론으로 사고력을 극대화하세요', priority: '최우선' },
      { href: '/consultation',    icon: '🔬', title: 'BGA 정밀 진단',  desc: '뇌파검사 연계 · 개인 맞춤 성장 설계', priority: '권장' },
    ],
  },
  Suitable: {
    label: 'Suitable',
    color: 'from-primary-500 to-primary-300',
    textColor: 'text-primary-500',
    bgColor: 'bg-primary-50',
    borderColor: 'border-primary-200',
    desc: '충분히 적합합니다. 바로 시작하실 수 있습니다.',
    icon: '✅',
    tagline: '적합한 시작 단계',
    strengths: [
      '기본적인 학습 의지와 목표 의식이 명확하게 형성되어 있습니다.',
      'AI 활용에 대한 긍정적 태도를 갖고 있어 빠른 적응이 기대됩니다.',
      '성장 가능성이 충분히 확인되어 체계적 프로그램 효과를 볼 수 있습니다.',
    ],
    improvements: [
      '자기주도 학습 습관을 더욱 강화하면 빠른 성장이 가능합니다.',
      'AI 도구에 대한 탐색과 실습 경험을 늘려 활용 역량을 키우세요.',
      '토론·글쓰기 등 표현 역량을 함께 개발하면 시너지 효과를 기대할 수 있습니다.',
    ],
    recommendation: '어울림토론 AI부터 시작하여 논리적 사고력을 키우면서, 자기경영 시스템으로 학습 루틴을 만들어 가세요. 3개월 후 BGA 진단을 통해 성장을 확인하시길 권장합니다.',
    programs: [
      { href: '/discussion',      icon: '🗣️', title: '어울림토론 AI',  desc: '시작 권장 · 논리적 사고력 강화', priority: '우선' },
      { href: '/self-management', icon: '📋', title: '자기경영 시스템', desc: '시작 권장 · 학습 루틴 형성', priority: '우선' },
      { href: '/consultation',    icon: '📞', title: '무료 상담 신청',  desc: '3개월 성장 로드맵 설계', priority: '권장' },
    ],
  },
  Basic: {
    label: 'Basic',
    color: 'from-accent-500 to-accent-300',
    textColor: 'text-accent-600',
    bgColor: 'bg-accent-50',
    borderColor: 'border-accent-200',
    desc: '기초 역량 개발이 필요합니다. 맞춤 프로그램을 추천합니다.',
    icon: '📈',
    tagline: '기초 역량 개발 단계',
    strengths: [
      '성장하고자 하는 의지와 가능성 자체는 충분히 확인됩니다.',
      '체계적인 프로그램을 통해 단계적으로 역량을 키울 수 있는 토대가 있습니다.',
    ],
    improvements: [
      '자기주도 학습 습관이 아직 형성되지 않아 이 부분을 먼저 개발해야 합니다.',
      '목표 설정과 시간 관리 능력을 강화하면 학습 효율이 크게 높아집니다.',
      'AI 도구 활용 경험이 부족하므로 기초부터 차근차근 시작하세요.',
      '학부모와 자녀 간 교육 철학 공유와 대화 시간을 늘려보세요.',
    ],
    recommendation: '먼저 자기경영 시스템으로 기초 학습 루틴을 만들고, 전문 상담을 통해 개인 맞춤 성장 계획을 수립하세요. 기초가 탄탄해지면 어울림토론 AI 참여를 권장합니다.',
    programs: [
      { href: '/self-management', icon: '📋', title: '자기경영 시스템', desc: '첫 단계 · 기초 학습 루틴 형성', priority: '먼저 시작' },
      { href: '/consultation',    icon: '📞', title: '1:1 맞춤 상담',   desc: '개인 맞춤 성장 계획 수립', priority: '강력 권장' },
      { href: '/discussion',      icon: '🗣️', title: '어울림토론 AI',  desc: '기초 역량 형성 후 참여', priority: '다음 단계' },
    ],
  },
  Exploring: {
    label: 'Exploring',
    color: 'from-neutral-500 to-neutral-400',
    textColor: 'text-neutral-600',
    bgColor: 'bg-neutral-50',
    borderColor: 'border-neutral-200',
    desc: '탐색 단계입니다. 먼저 상담을 받아보시길 권장합니다.',
    icon: '🔍',
    tagline: '탐색 및 준비 단계',
    strengths: [
      '진단에 참여하신 것 자체가 성장을 향한 첫 발걸음입니다.',
      '현재 상태를 정확히 파악했으므로 올바른 방향을 찾을 수 있습니다.',
    ],
    improvements: [
      '학습 목표와 동기를 먼저 명확히 설정하는 것이 우선입니다.',
      '자녀의 강점과 관심사를 파악하는 시간을 충분히 갖는 것이 중요합니다.',
      '부담 없이 상담을 통해 전문가와 함께 방향을 찾아가세요.',
    ],
    recommendation: '지금 당장 프로그램 시작보다는 전문 상담을 통해 자녀의 현재 상태와 성장 가능성을 먼저 파악하시길 권장합니다. 맞춤 준비 과정 이후 단계적 참여를 설계해 드립니다.',
    programs: [
      { href: '/consultation',    icon: '📞', title: '무료 전문 상담',  desc: '지금 바로 · 현재 상태 파악 및 방향 설계', priority: '가장 먼저' },
      { href: '/self-management', icon: '📋', title: '자기경영 시스템', desc: '상담 후 · 기초 습관 형성', priority: '추후 시작' },
      { href: '/discussion',      icon: '🗣️', title: '어울림토론 AI',  desc: '준비 완료 후 · 단계적 참여', priority: '추후 시작' },
    ],
  },
}

function getLevel(total: number) {
  if (total >= 85) return 'Excellence'
  if (total >= 70) return 'Suitable'
  if (total >= 55) return 'Basic'
  return 'Exploring'
}

/* ─── 점수 바 ─── */
function ScoreBar({ label, score, max, color, subLabel }: {
  label: string; score: number; max: number; color: string; subLabel?: string
}) {
  const [w, setW] = useState(0)
  useEffect(() => { setTimeout(() => setW(score), 300) }, [score])
  const pct = Math.round((score / max) * 100)
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <div>
          <span className="font-semibold text-neutral-700">{label}</span>
          {subLabel && <span className="ml-2 text-xs text-neutral-400">{subLabel}</span>}
        </div>
        <span className="font-bold" style={{ color }}>{score}점 / {max}점
          <span className="text-xs text-neutral-400 font-normal ml-1">({pct}%)</span>
        </span>
      </div>
      <div className="score-bar-track">
        <div
          className="score-bar-fill transition-all duration-1000 ease-out"
          style={{ width: `${(w / max) * 100}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

/* ─── 강점/개선점 아이템 ─── */
function FeedbackItem({ text, type }: { text: string; type: 'strength' | 'improvement' }) {
  return (
    <li className="flex items-start gap-3 text-sm text-neutral-700">
      <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-bold
        ${type === 'strength' ? 'bg-primary-100 text-primary-600' : 'bg-accent-100 text-accent-600'}`}>
        {type === 'strength' ? '✓' : '↑'}
      </span>
      <span className="leading-relaxed">{text}</span>
    </li>
  )
}

/* ─── 추천 프로그램 카드 ─── */
function ProgramCard({ href, icon, title, desc, priority }: {
  href: string; icon: string; title: string; desc: string; priority: string
}) {
  const priorityColor = priority === '최우선' || priority === '가장 먼저'
    ? 'bg-accent-100 text-accent-700'
    : priority === '우선' || priority === '먼저 시작' || priority === '강력 권장'
    ? 'bg-primary-100 text-primary-700'
    : 'bg-neutral-100 text-neutral-500'

  return (
    <Link href={href} className="card card-hover p-4 flex items-center gap-4 group">
      <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-xl group-hover:bg-primary-100 transition flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <div className="font-bold text-neutral-800 text-sm">{title}</div>
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${priorityColor}`}>{priority}</span>
        </div>
        <div className="text-xs text-neutral-500">{desc}</div>
      </div>
      <span className="text-neutral-300 group-hover:text-primary-400 transition flex-shrink-0">→</span>
    </Link>
  )
}

/* ─── 결과 본문 ─── */
function ResultContent() {
  const params = useSearchParams()
  const total  = Number(params.get('total')  ?? 70)
  const ai     = Number(params.get('ai')     ?? 22)
  const growth = Number(params.get('growth') ?? 30)
  const engage = Number(params.get('engage') ?? 22)
  const childName = params.get('name') ?? ''
  const level  = getLevel(total)
  const lv     = levelMap[level as keyof typeof levelMap]

  const [showScore, setShowScore] = useState(false)
  useEffect(() => { setTimeout(() => setShowScore(true), 200) }, [])

  /* 영역별 등급 라벨 */
  const getGrade = (score: number, max: number) => {
    const r = score / max
    if (r >= 0.87) return { label: '매우 우수', color: '#1E4FD8' }
    if (r >= 0.70) return { label: '우수',     color: '#5476EB' }
    if (r >= 0.55) return { label: '보통',     color: '#F9A21B' }
    return { label: '개발 필요', color: '#F96167' }
  }

  const aiGrade     = getGrade(ai,     30)
  const growthGrade = getGrade(growth, 40)
  const engageGrade = getGrade(engage, 30)

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── 레벨 카드 ── */}
        <div className={`rounded-3xl bg-gradient-to-br ${lv.color} p-8 text-white text-center shadow-deep`}>
          <div className="text-5xl mb-3">{lv.icon}</div>
          <div className="text-xs font-bold tracking-widest uppercase opacity-70 mb-1">성장 적합도 진단 결과</div>
          {childName && <div className="text-lg font-semibold opacity-90 mb-1">{childName} 님의 결과</div>}
          <div className="text-4xl font-black mb-1">{lv.label}</div>
          <div className="text-sm font-semibold opacity-80 mb-4">{lv.tagline}</div>
          <div className="inline-flex items-baseline gap-1 bg-white/20 rounded-2xl px-6 py-2 mb-4">
            <span className="text-5xl font-black">{showScore ? total : 0}</span>
            <span className="text-xl font-semibold opacity-80">/ 100점</span>
          </div>
          <p className="text-white/90 text-sm leading-relaxed max-w-sm mx-auto">{lv.desc}</p>

          {/* 레벨 스케일 바 */}
          <div className="mt-6 flex gap-1 justify-center">
            {[
              { l: 'Exploring', r: '~54', active: level === 'Exploring' },
              { l: 'Basic',     r: '55~69', active: level === 'Basic' },
              { l: 'Suitable',  r: '70~84', active: level === 'Suitable' },
              { l: 'Excellence',r: '85~',   active: level === 'Excellence' },
            ].map(s => (
              <div key={s.l} className={`flex-1 rounded py-1.5 text-[10px] font-bold transition-all
                ${s.active ? 'bg-white text-neutral-800 shadow' : 'bg-white/20 text-white/60'}`}>
                {s.l}
              </div>
            ))}
          </div>
        </div>

        {/* ── 영역별 점수 분석 ── */}
        <div className="card p-6 space-y-5">
          <h2 className="font-bold text-neutral-800 text-base">영역별 점수 분석</h2>
          <ScoreBar label="AI 활용 적합성" subLabel={`→ ${aiGrade.label}`}     score={ai}     max={30} color={aiGrade.color} />
          <ScoreBar label="성장 가능성"    subLabel={`→ ${growthGrade.label}`}  score={growth} max={40} color={growthGrade.color} />
          <ScoreBar label="참여 역량"      subLabel={`→ ${engageGrade.label}`}  score={engage} max={30} color={engageGrade.color} />

          {/* 레이더형 요약 텍스트 */}
          <div className="bg-neutral-50 rounded-xl p-4 text-sm text-neutral-600 space-y-1 border border-neutral-100">
            <div className="flex items-center gap-2"><span className="text-lg">🤖</span>
              <span><b>AI 활용</b>: {ai >= 22 ? '디지털 환경 적응력이 높아 AI 도구를 빠르게 습득할 것으로 예상됩니다.' : 'AI 도구 기초 사용법부터 단계적으로 익혀나가면 충분히 개선됩니다.'}</span>
            </div>
            <div className="flex items-center gap-2"><span className="text-lg">🌱</span>
              <span><b>성장 잠재력</b>: {growth >= 30 ? '높은 성장 동기와 잠재력이 확인됩니다. 적절한 자극과 환경이 주어지면 빠르게 성장할 수 있습니다.' : '지속적인 관심과 동기 부여를 통해 성장 잠재력을 끌어올릴 수 있습니다.'}</span>
            </div>
            <div className="flex items-center gap-2"><span className="text-lg">🤝</span>
              <span><b>참여 역량</b>: {engage >= 22 ? '학부모 참여도와 교육 관심이 높아 가정-기관 협력이 원활할 것으로 기대됩니다.' : '학부모 참여를 높이는 맞춤 코칭 프로그램을 함께 진행하면 효과가 배가됩니다.'}</span>
            </div>
          </div>
        </div>

        {/* ── 강점 분석 ── */}
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-neutral-800 text-base flex items-center gap-2">
            <span className="text-lg">💪</span> 확인된 강점
          </h2>
          <ul className="space-y-3">
            {lv.strengths.map((s, i) => <FeedbackItem key={i} text={s} type="strength" />)}
          </ul>
        </div>

        {/* ── 개선 포인트 ── */}
        <div className="card p-6 space-y-4">
          <h2 className="font-bold text-neutral-800 text-base flex items-center gap-2">
            <span className="text-lg">📍</span> 성장 포인트
          </h2>
          <ul className="space-y-3">
            {lv.improvements.map((s, i) => <FeedbackItem key={i} text={s} type="improvement" />)}
          </ul>
        </div>

        {/* ── 맞춤 추천 메시지 ── */}
        <div className={`rounded-2xl border-2 ${lv.borderColor} ${lv.bgColor} p-5`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">🎯</span>
            <div>
              <div className="font-bold text-neutral-800 text-sm mb-2">전문가 추천 로드맵</div>
              <p className="text-sm text-neutral-700 leading-relaxed">{lv.recommendation}</p>
            </div>
          </div>
        </div>

        {/* ── 추천 프로그램 ── */}
        <div className="space-y-3">
          <h2 className="font-bold text-neutral-800 text-base">{lv.label} 레벨 맞춤 프로그램</h2>
          {lv.programs.map((p) => (
            <ProgramCard key={p.href} {...p} />
          ))}
        </div>

        {/* ── 하단 버튼 ── */}
        <div className="flex gap-3">
          <Link href="/diagnosis" className="btn-outline flex-1 text-center py-3.5">
            다시 진단하기
          </Link>
          <Link href="/consultation" className="btn-accent flex-1 text-center py-3.5">
            상담 신청하기 →
          </Link>
        </div>

        <p className="text-xs text-neutral-400 text-center pb-2">
          본 진단 결과는 참고용이며, 정밀 진단을 위해 전문가 상담을 권장합니다
        </p>
      </div>
    </div>
  )
}

export default function DiagnosisResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-neutral-400">결과 분석 중...</div>}>
      <ResultContent />
    </Suspense>
  )
}
