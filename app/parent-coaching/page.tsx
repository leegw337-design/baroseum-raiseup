'use client'
import { useState } from 'react'
import Link from 'next/link'

type Role = 'none' | 'parent' | 'admin'

/* ─── 코칭 세션 기록 타입 ─── */
type CoachingSession = {
  id: number
  date: string
  type: '대면 상담' | '화상 상담' | '전화 상담'
  topic: string
  coach: string
  summary: string
  homework: string
  nextDate: string
}

/* ─── 성장 추이 ─── */
type GrowthPoint = {
  month: string
  score: number
}

/* ─── 자기경영 주간 데이터 ─── */
type WeekData = {
  week: string
  timetable: number
  goal: number
}

/* ─── 더미 데이터 ─── */
const students = [
  {
    name: '김민준', grade: '중학교 2학년', level: 'Suitable', score: 76,
    areas: [
      { label: 'AI 활용', score: 22, max: 30 },
      { label: '성장가능성', score: 34, max: 40 },
      { label: '참여역량', score: 20, max: 30 },
    ],
    summary: '자기주도학습 의지가 높고 논리적 사고력이 우수합니다. 감정 조절 훈련을 병행하면 더 큰 성장을 기대할 수 있습니다.',
    growthData: [
      { month: '5월', score: 62 },
      { month: '6월', score: 68 },
      { month: '7월', score: 72 },
      { month: '8월', score: 76 },
    ] as GrowthPoint[],
    coachingSessions: [
      {
        id: 1, date: '2026-08-15', type: '대면 상담' as const,
        topic: '자기경영 목표 설정 및 시간관리 전략',
        coach: '박소연 멘토',
        summary: '아이젠하워 매트릭스를 활용한 우선순위 관리법을 익히고, 주간 학습 루틴을 설계했습니다. 방과 후 2시간을 집중 학습 시간으로 확보하기로 하였습니다.',
        homework: '주간 플래너 작성 및 매일 저녁 10분 성찰 일기 쓰기',
        nextDate: '2026-09-12',
      },
      {
        id: 2, date: '2026-07-20', type: '화상 상담' as const,
        topic: '어울림토론 1개월 참여 중간 점검',
        coach: '박소연 멘토',
        summary: '토론 참여 이후 의사표현 능력이 향상되었습니다. 주장에 근거를 제시하는 능력이 특히 발전했으며, 반론 수용 능력도 개선 중입니다.',
        homework: '관심 주제 1가지 선정 후 찬반 논거 각 3개 준비',
        nextDate: '2026-08-15',
      },
      {
        id: 3, date: '2026-06-10', type: '대면 상담' as const,
        topic: '초기 진단 결과 분석 및 성장 로드맵 수립',
        coach: '이정호 원장',
        summary: 'Suitable 레벨 진단 결과를 바탕으로 3개월 성장 로드맵을 수립하였습니다. 어울림토론과 자기경영 시스템을 병행하는 계획을 수립했습니다.',
        homework: '어울림토론 AI 체험 후 소감 작성',
        nextDate: '2026-07-20',
      },
    ] as CoachingSession[],
    nextSession: { date: '2026-09-12', type: '대면 상담', topic: '3개월 성장 종합 평가' },
    programs: ['어울림토론 AI', '자기경영 시스템'],
    diagnosisDate: '2026-06-01',
    selfMgmt: {
      timetableRate: 78,
      weeklyGoalRate: 72,
      aiChatCount: 14,
      matrixStats: { do: 8, schedule: 12, delegate: 5, eliminate: 3 },
      weeklyData: [
        { week: '1주', timetable: 65, goal: 60 },
        { week: '2주', timetable: 72, goal: 68 },
        { week: '3주', timetable: 80, goal: 75 },
        { week: '4주', timetable: 78, goal: 72 },
      ] as WeekData[],
      topGoals: ['영어 단어 암기 (매일)', '수학 문제풀기 (주 5회)', '독서 30분 (매일)', '운동 (주 3회)'],
      coachFeedback: '자기경영 AI와의 대화를 통해 규칙적인 생활 루틴이 정착되고 있습니다. 아이젠하워 매트릭스 활용도가 높으며, 중요 과제 우선순위 설정 능력이 향상되었습니다. 특히 3주차부터 시간표 이행률이 80%를 넘어 긍정적인 신호를 보이고 있습니다.',
    },
    coachReport: {
      overallScore: 82,
      attendanceRate: 100,
      homeworkRate: 88,
      coachNote: '민준이는 3개월간 꾸준히 성장하고 있습니다. 특히 자기주도학습 능력과 목표 설정 역량이 눈에 띄게 향상되었습니다. 초기 대비 논리적 사고력과 의사표현 능력 모두 개선되었으며, 감정 조절 훈련을 병행하면 Excellence 레벨 달성이 충분히 가능합니다.',
      strengths: ['자기주도학습 의지 강함', '목표 설정 능력 우수', '논리적 사고력 발전'],
      improvements: ['감정 조절 능력 보완 필요', '장기 목표와 단기 계획 연결 훈련'],
      nextGoals: ['Excellence 레벨 달성 (목표: 10월)', '논설문 쓰기 능력 향상', '어울림토론 심화 과정 참여'],
      recommendation: '현재 Suitable → Excellence 달성까지 약 9점 향상 필요합니다. 감정 코칭 프로그램 추가 수강을 권장드립니다.',
    },
  },
  {
    name: '이서아', grade: '초등학교 6학년', level: 'Excellence', score: 88,
    areas: [
      { label: 'AI 활용', score: 27, max: 30 },
      { label: '성장가능성', score: 38, max: 40 },
      { label: '참여역량', score: 23, max: 30 },
    ],
    summary: '전 영역에서 탁월한 잠재력을 보여줍니다. 어울림토론 프로그램을 통해 논리력을 더욱 심화시키길 권장합니다.',
    growthData: [
      { month: '5월', score: 80 },
      { month: '6월', score: 83 },
      { month: '7월', score: 86 },
      { month: '8월', score: 88 },
    ] as GrowthPoint[],
    coachingSessions: [
      {
        id: 1, date: '2026-08-20', type: '대면 상담' as const,
        topic: '심화 과정 설계 — 논리적 글쓰기 병행 프로그램',
        coach: '이정호 원장',
        summary: '탁월한 역량을 기반으로 논리적 글쓰기와 어울림토론 심화 과정을 병행하는 계획을 수립했습니다. BGA 정밀 진단 결과 집중력과 창의성 지수가 상위 5% 수준입니다.',
        homework: '자신이 관심있는 사회 이슈 1개를 골라 5단락 논설문 작성',
        nextDate: '2026-09-18',
      },
    ] as CoachingSession[],
    nextSession: { date: '2026-09-18', type: '화상 상담', topic: '논설문 피드백 및 심화 과정 2단계 설계' },
    programs: ['어울림토론 AI', '자기경영 시스템', '심화 글쓰기'],
    diagnosisDate: '2026-05-15',
    selfMgmt: {
      timetableRate: 91,
      weeklyGoalRate: 88,
      aiChatCount: 22,
      matrixStats: { do: 15, schedule: 18, delegate: 4, eliminate: 1 },
      weeklyData: [
        { week: '1주', timetable: 85, goal: 82 },
        { week: '2주', timetable: 90, goal: 86 },
        { week: '3주', timetable: 93, goal: 90 },
        { week: '4주', timetable: 91, goal: 88 },
      ] as WeekData[],
      topGoals: ['논설문 작성 (주 2편)', '어울림토론 AI 연습 (매일)', '수학 심화 (주 4회)', '영어 독해 (매일)'],
      coachFeedback: '매우 높은 자기경영 수준을 보여주고 있습니다. 시간표 이행률이 90% 이상을 유지하고 있으며, 목표 달성률도 우수합니다. 심화 과제에서도 주도적으로 실행하는 패턴이 돋보이며, AI 코칭 활용 횟수도 가장 많습니다.',
    },
    coachReport: {
      overallScore: 95,
      attendanceRate: 100,
      homeworkRate: 100,
      coachNote: '서아의 성장 속도는 탁월합니다. 모든 과제를 성실히 이행하며 스스로 심화 학습 방향을 찾아가는 능력을 보여주고 있습니다. 현재 수준에서 외부 대회 참여나 리더십 프로그램 도전을 강력히 권장합니다.',
      strengths: ['탁월한 집중력과 자기주도성', '논리적 글쓰기 역량 우수', '꾸준한 루틴 실천'],
      improvements: ['다양한 관점 수용 능력 확장', '팀 협업 프로젝트 경험 필요'],
      nextGoals: ['Excellence 최상위권 유지', '논리적 글쓰기 대회 참여', '리더십 프로그램 도전'],
      recommendation: '현재 Excellence 최상위권을 유지 중입니다. 외부 대회나 리더십 프로그램 참여를 통해 역량을 더욱 확장할 것을 권장합니다.',
    },
  },
]

const adminStats = [
  { label: '전체 학생', value: '24', unit: '명', color: 'text-primary-600', icon: '👥' },
  { label: '이번 달 진단', value: '18', unit: '건', color: 'text-accent-600', icon: '📋' },
  { label: '평균 점수', value: '73.4', unit: '점', color: 'text-primary-500', icon: '📊' },
  { label: 'Excellence', value: '6', unit: '명', color: 'text-amber-500', icon: '🏆' },
]

const allStudents = [
  { name: '김민준', grade: '중2', level: 'Suitable', score: 76, lastSession: '2026-08-15', nextSession: '2026-09-12', coach: '박소연' },
  { name: '이서아', grade: '초6', level: 'Excellence', score: 88, lastSession: '2026-08-20', nextSession: '2026-09-18', coach: '이정호' },
  { name: '박지호', grade: '중1', level: 'Basic', score: 62, lastSession: '2026-08-10', nextSession: '2026-09-10', coach: '박소연' },
  { name: '최유나', grade: '초5', level: 'Suitable', score: 74, lastSession: '2026-08-05', nextSession: '2026-09-05', coach: '이정호' },
  { name: '정승현', grade: '중3', level: 'Excellence', score: 91, lastSession: '2026-08-22', nextSession: '2026-09-20', coach: '이정호' },
]

const levelColor: Record<string, string> = {
  Excellence: 'badge bg-primary-100 text-primary-700',
  Suitable:   'badge bg-primary-50 text-primary-500',
  Basic:      'badge bg-accent-100 text-accent-700',
  Exploring:  'badge bg-neutral-100 text-neutral-500',
}

const sessionTypeColor: Record<string, string> = {
  '대면 상담': 'bg-primary-100 text-primary-700',
  '화상 상담': 'bg-accent-100 text-accent-700',
  '전화 상담': 'bg-neutral-100 text-neutral-600',
}

/* ─── 미니 성장 차트 ─── */
function MiniGrowthChart({ data }: { data: GrowthPoint[] }) {
  const min = Math.min(...data.map(d => d.score)) - 5
  const max = Math.max(...data.map(d => d.score)) + 5
  const range = max - min
  const W = 280, H = 80, PAD = 16

  const points = data.map((d, i) => ({
    x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
    y: H - PAD - ((d.score - min) / range) * (H - PAD * 2),
    score: d.score,
    month: d.month,
  }))

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD = `${pathD} L ${points[points.length - 1].x} ${H - PAD} L ${points[0].x} ${H - PAD} Z`

  return (
    <div className="mt-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 80 }}>
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E4FD8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#1E4FD8" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#chartGrad)" />
        <path d={pathD} fill="none" stroke="#1E4FD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={4} fill="#1E4FD8" />
            <text x={p.x} y={H - 2} textAnchor="middle" fontSize="9" fill="#9CA3AF">{p.month}</text>
            <text x={p.x} y={p.y - 7} textAnchor="middle" fontSize="9" fill="#1E4FD8" fontWeight="700">{p.score}</text>
          </g>
        ))}
      </svg>
    </div>
  )
}

/* ─── 주간 자기경영 차트 ─── */
function WeeklyChart({ data }: { data: WeekData[] }) {
  const W = 280, H = 90, PAD = 20
  const maxVal = 100

  const timetablePoints = data.map((d, i) => ({
    x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
    y: H - PAD - (d.timetable / maxVal) * (H - PAD * 2),
    val: d.timetable,
    week: d.week,
  }))
  const goalPoints = data.map((d, i) => ({
    x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
    y: H - PAD - (d.goal / maxVal) * (H - PAD * 2),
    val: d.goal,
  }))

  const tPath = timetablePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const gPath = goalPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 90 }}>
        <path d={tPath} fill="none" stroke="#1E4FD8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d={gPath} fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 2" />
        {timetablePoints.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={3.5} fill="#1E4FD8" />
            <text x={p.x} y={H - 2} textAnchor="middle" fontSize="9" fill="#9CA3AF">{p.week}</text>
            <text x={p.x} y={p.y - 6} textAnchor="middle" fontSize="9" fill="#1E4FD8" fontWeight="700">{p.val}%</text>
          </g>
        ))}
        {goalPoints.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3.5} fill="#F97316" />
        ))}
      </svg>
      <div className="flex items-center gap-4 mt-1 justify-center">
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <div className="w-4 h-0.5 bg-primary-500 rounded" />
          시간표 이행률
        </div>
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <div className="w-4 h-0.5 bg-orange-400 rounded" style={{ borderTop: '2px dashed #F97316', background: 'none' }} />
          목표 달성률
        </div>
      </div>
    </div>
  )
}

/* ─── 아이젠하워 매트릭스 통계 바 ─── */
function MatrixBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = Math.round((count / total) * 100)
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-neutral-600 font-medium">{label}</span>
        <span className="font-bold text-neutral-700">{count}개 ({pct}%)</span>
      </div>
      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

/* ─── 로그인 폼 ─── */
function LoginForm({ onLogin }: { onLogin: (r: Role) => void }) {
  const [email, setEmail] = useState(() => {
    try { return localStorage.getItem('coaching_email') ?? '' } catch { return '' }
  })
  const [pw, setPw] = useState('')
  const [remembered, setRemembered] = useState(() => {
    try { return !!localStorage.getItem('coaching_email') } catch { return false }
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (remembered) localStorage.setItem('coaching_email', email)
      else localStorage.removeItem('coaching_email')
    } catch {}
    if (email.includes('admin')) onLogin('admin')
    else onLogin('parent')
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="card p-8 w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-hero-gradient flex items-center justify-center mx-auto mb-4 text-white text-2xl">👨‍👩‍👧</div>
          <h2 className="text-xl font-black text-neutral-900">학부모 코칭 로그인</h2>
          <p className="text-sm text-neutral-500 mt-1">자녀의 성장 보고서와 코칭 기록을 확인하세요</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">이메일</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="example@email.com" className="input-base" required />
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">비밀번호</label>
            <input type="password" value={pw} onChange={e => setPw(e.target.value)}
              placeholder="••••••••" className="input-base" required />
          </div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={remembered}
              onChange={e => setRemembered(e.target.checked)}
              className="w-4 h-4 rounded accent-primary-500 cursor-pointer"
            />
            <span className="text-sm text-neutral-500">이메일 기억하기</span>
          </label>
          <button type="submit" className="btn-primary w-full py-3.5">로그인</button>
        </form>
        <div className="border-t border-neutral-100 pt-4 space-y-2 text-sm text-center text-neutral-400">
          <p>테스트: 일반 이메일 → 학부모 뷰 / <strong>admin@...</strong> → 관리자 뷰</p>
          <Link href="/consultation" className="text-primary-500 hover:underline">계정이 없으신가요? 상담 신청하기 →</Link>
        </div>
      </div>
    </div>
  )
}

/* ─── 학부모 뷰 ─── */
function ParentView({ onLogout }: { onLogout: () => void }) {
  const [selected, setSelected] = useState(0)
  const [activeTab, setActiveTab] = useState<'overview' | 'selfmgmt' | 'report' | 'coaching' | 'growth'>('overview')
  const [expandedSession, setExpandedSession] = useState<number | null>(null)
  const s = students[selected]

  return (
    <div className="min-h-screen bg-neutral-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-neutral-900">학부모 코칭 대시보드</h1>
            <p className="text-sm text-neutral-500">자녀의 성장 현황과 코칭 기록을 확인하세요</p>
          </div>
          <button onClick={onLogout} className="btn-ghost text-sm border border-neutral-200 rounded-xl px-4 py-2">로그아웃</button>
        </div>

        {/* 자녀 선택 탭 */}
        <div className="card p-2 flex gap-2">
          {students.map((st, i) => (
            <button key={i} onClick={() => { setSelected(i); setActiveTab('overview') }}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all
                ${selected === i ? 'bg-hero-gradient text-white shadow-card' : 'text-neutral-500 hover:bg-neutral-50'}`}>
              {st.name} · {st.grade}
            </button>
          ))}
        </div>

        {/* 점수 카드 */}
        <div className="card-primary p-6">
          <div className="flex items-start gap-5">
            <div className="text-center flex-shrink-0">
              <div className="text-5xl font-black">{s.score}</div>
              <div className="text-white/70 text-xs mt-1">/ 100점</div>
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black">{s.name}</h2>
                <span className={levelColor[s.level]}>{s.level}</span>
              </div>
              <p className="text-primary-100 text-sm">{s.grade} · 진단일 {s.diagnosisDate}</p>
              <p className="text-white/80 text-sm leading-relaxed">{s.summary}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {s.programs.map(p => (
                  <span key={p} className="text-[11px] px-2.5 py-1 rounded-full bg-white/20 text-white font-medium">{p}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 서브 탭 */}
        <div className="card p-1.5 flex gap-1 flex-wrap">
          {([
            { key: 'overview',  label: '📊 성장 현황' },
            { key: 'selfmgmt', label: '📋 자기경영 리포트' },
            { key: 'report',   label: '📝 코칭 결과 리포트' },
            { key: 'coaching', label: '🗓️ 코칭 기록' },
            { key: 'growth',   label: '📈 성장 추이' },
          ] as const).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all min-w-[80px]
                ${activeTab === tab.key ? 'bg-primary-500 text-white shadow' : 'text-neutral-500 hover:bg-neutral-50'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── 탭 1: 성장 현황 ── */}
        {activeTab === 'overview' && (
          <>
            {/* 영역별 점수 */}
            <div className="card p-6 space-y-4">
              <h3 className="font-bold text-neutral-800">영역별 상세 점수</h3>
              {s.areas.map(a => (
                <div key={a.label} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-neutral-600">{a.label}</span>
                    <span className="font-bold text-primary-600">{a.score} / {a.max}점</span>
                  </div>
                  <div className="score-bar-track">
                    <div className="score-bar-fill bg-primary-500 transition-all duration-700"
                      style={{ width: `${(a.score / a.max) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* 다음 코칭 일정 */}
            <div className="card p-5 border-l-4 border-primary-400">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📅</span>
                <div className="flex-1">
                  <div className="text-xs text-neutral-500 mb-0.5">다음 코칭 일정</div>
                  <div className="font-black text-neutral-800 text-base">{s.nextSession.date}</div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${sessionTypeColor[s.nextSession.type]}`}>
                      {s.nextSession.type}
                    </span>
                    <span className="text-sm text-neutral-600">{s.nextSession.topic}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 빠른 실행 버튼 */}
            <div className="grid grid-cols-2 gap-3">
              <Link href="/diagnosis" className="card card-hover p-4 flex items-center gap-3 group">
                <span className="text-2xl">🔍</span>
                <div>
                  <div className="font-bold text-sm text-neutral-800">재진단하기</div>
                  <div className="text-xs text-neutral-500">3개월마다 권장</div>
                </div>
              </Link>
              <Link href="/consultation" className="card card-hover p-4 flex items-center gap-3 group">
                <span className="text-2xl">📞</span>
                <div>
                  <div className="font-bold text-sm text-neutral-800">상담 신청</div>
                  <div className="text-xs text-neutral-500">추가 코칭 예약</div>
                </div>
              </Link>
              <Link href="/discussion" className="card card-hover p-4 flex items-center gap-3 group">
                <span className="text-2xl">🗣️</span>
                <div>
                  <div className="font-bold text-sm text-neutral-800">어울림토론</div>
                  <div className="text-xs text-neutral-500">AI 토론 연습</div>
                </div>
              </Link>
              <Link href="/self-management" className="card card-hover p-4 flex items-center gap-3 group">
                <span className="text-2xl">📋</span>
                <div>
                  <div className="font-bold text-sm text-neutral-800">자기경영</div>
                  <div className="text-xs text-neutral-500">목표·할 일 관리</div>
                </div>
              </Link>
            </div>
          </>
        )}

        {/* ── 탭 2: 자기경영 분석 리포트 ── */}
        {activeTab === 'selfmgmt' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-neutral-800">자기경영 분석 리포트</h3>
              <span className="text-xs text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">최근 4주 기준</span>
            </div>

            {/* 핵심 지표 3개 */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  icon: '⏰',
                  label: '시간표 이행률',
                  value: `${s.selfMgmt.timetableRate}%`,
                  sub: s.selfMgmt.timetableRate >= 80 ? '우수' : s.selfMgmt.timetableRate >= 60 ? '양호' : '개선 필요',
                  color: s.selfMgmt.timetableRate >= 80 ? 'text-primary-600' : s.selfMgmt.timetableRate >= 60 ? 'text-amber-500' : 'text-red-500',
                  bg: s.selfMgmt.timetableRate >= 80 ? 'bg-primary-50' : s.selfMgmt.timetableRate >= 60 ? 'bg-amber-50' : 'bg-red-50',
                },
                {
                  icon: '🎯',
                  label: '목표 달성률',
                  value: `${s.selfMgmt.weeklyGoalRate}%`,
                  sub: s.selfMgmt.weeklyGoalRate >= 80 ? '우수' : s.selfMgmt.weeklyGoalRate >= 60 ? '양호' : '개선 필요',
                  color: s.selfMgmt.weeklyGoalRate >= 80 ? 'text-primary-600' : s.selfMgmt.weeklyGoalRate >= 60 ? 'text-amber-500' : 'text-red-500',
                  bg: s.selfMgmt.weeklyGoalRate >= 80 ? 'bg-primary-50' : s.selfMgmt.weeklyGoalRate >= 60 ? 'bg-amber-50' : 'bg-red-50',
                },
                {
                  icon: '🤖',
                  label: 'AI 코칭 대화',
                  value: `${s.selfMgmt.aiChatCount}회`,
                  sub: '이번 달',
                  color: 'text-accent-600',
                  bg: 'bg-accent-50',
                },
              ].map((item, i) => (
                <div key={i} className={`card p-4 text-center ${item.bg}`}>
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className={`text-xl font-black ${item.color}`}>{item.value}</div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">{item.label}</div>
                  <div className={`text-[10px] font-semibold mt-0.5 ${item.color}`}>{item.sub}</div>
                </div>
              ))}
            </div>

            {/* 주간 추이 차트 */}
            <div className="card p-5 space-y-3">
              <h4 className="font-bold text-neutral-800 text-sm">주간 이행률 추이</h4>
              <WeeklyChart data={s.selfMgmt.weeklyData} />
            </div>

            {/* 아이젠하워 매트릭스 활용 통계 */}
            <div className="card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-neutral-800 text-sm">아이젠하워 매트릭스 활용</h4>
                <span className="text-xs text-neutral-400">
                  총 {Object.values(s.selfMgmt.matrixStats).reduce((a, b) => a + b, 0)}개 과제 분류
                </span>
              </div>
              {(() => {
                const total = Object.values(s.selfMgmt.matrixStats).reduce((a, b) => a + b, 0)
                return (
                  <div className="space-y-3">
                    <MatrixBar label="🔴 즉시 실행 (긴급·중요)" count={s.selfMgmt.matrixStats.do} total={total} color="bg-red-400" />
                    <MatrixBar label="🔵 계획 실행 (중요·여유)" count={s.selfMgmt.matrixStats.schedule} total={total} color="bg-primary-500" />
                    <MatrixBar label="🟡 위임 검토 (긴급·덜중요)" count={s.selfMgmt.matrixStats.delegate} total={total} color="bg-amber-400" />
                    <MatrixBar label="⚪ 제거 고려 (덜중요·여유)" count={s.selfMgmt.matrixStats.eliminate} total={total} color="bg-neutral-300" />
                  </div>
                )
              })()}
            </div>

            {/* 주요 목표 */}
            <div className="card p-5 space-y-3">
              <h4 className="font-bold text-neutral-800 text-sm">📌 주요 반복 목표</h4>
              <div className="space-y-2">
                {s.selfMgmt.topGoals.map((goal, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-2 border-b border-neutral-50 last:border-0">
                    <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-[10px] font-black flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-sm text-neutral-700">{goal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI 코치 피드백 */}
            <div className="bg-primary-50 border border-primary-200 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🤖</span>
                <span className="font-bold text-primary-800 text-sm">AI 코치 분석 피드백</span>
              </div>
              <p className="text-sm text-primary-700 leading-relaxed">{s.selfMgmt.coachFeedback}</p>
            </div>
          </div>
        )}

        {/* ── 탭 3: 코칭 결과 리포트 ── */}
        {activeTab === 'report' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-neutral-800">코칭 결과 리포트</h3>
              <span className="text-xs text-neutral-400 bg-neutral-100 px-3 py-1 rounded-full">담당 코치 작성</span>
            </div>

            {/* 종합 점수 배너 */}
            <div className="card-primary p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white/70 text-xs">코칭 종합 평가 점수</div>
                  <div className="text-5xl font-black mt-0.5">{s.coachReport.overallScore}</div>
                  <div className="text-white/70 text-xs">/ 100점</div>
                </div>
                <div className="text-right space-y-2">
                  <div>
                    <div className="text-white/70 text-[11px]">참여율</div>
                    <div className="text-2xl font-black">{s.coachReport.attendanceRate}%</div>
                  </div>
                  <div>
                    <div className="text-white/70 text-[11px]">과제 이행률</div>
                    <div className="text-2xl font-black">{s.coachReport.homeworkRate}%</div>
                  </div>
                </div>
              </div>

              {/* 게이지 바 */}
              <div className="space-y-2">
                <div className="text-white/70 text-xs mb-1">종합 점수</div>
                <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all duration-1000"
                    style={{ width: `${s.coachReport.overallScore}%` }} />
                </div>
              </div>
            </div>

            {/* 코치 소견 */}
            <div className="card p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 text-sm">
                  👩‍🏫
                </div>
                <div>
                  <div className="font-bold text-sm text-neutral-800">코치 종합 소견</div>
                  <div className="text-xs text-neutral-400">{s.coachingSessions[0]?.coach}</div>
                </div>
              </div>
              <p className="text-sm text-neutral-700 leading-relaxed bg-neutral-50 rounded-xl p-4">
                {s.coachReport.coachNote}
              </p>
            </div>

            {/* 강점 & 개선점 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card p-5 space-y-3">
                <h4 className="font-bold text-sm text-neutral-800 flex items-center gap-1.5">
                  <span>✅</span> 강점
                </h4>
                <div className="space-y-2">
                  {s.coachReport.strengths.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="card p-5 space-y-3">
                <h4 className="font-bold text-sm text-neutral-800 flex items-center gap-1.5">
                  <span>🔧</span> 보완 영역
                </h4>
                <div className="space-y-2">
                  {s.coachReport.improvements.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 다음 목표 */}
            <div className="card p-5 space-y-3">
              <h4 className="font-bold text-sm text-neutral-800 flex items-center gap-1.5">
                <span>🎯</span> 다음 단계 목표
              </h4>
              <div className="space-y-2">
                {s.coachReport.nextGoals.map((goal, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 px-3 bg-primary-50 rounded-xl">
                    <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs font-black flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="text-sm font-medium text-primary-800">{goal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 코치 권고 사항 */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">💡</span>
                <span className="font-bold text-amber-800 text-sm">코치 권고 사항</span>
              </div>
              <p className="text-sm text-amber-700 leading-relaxed">{s.coachReport.recommendation}</p>
            </div>

            {/* 다음 코칭 예약 */}
            <div className="card p-5 border-l-4 border-primary-400 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-neutral-500 mb-0.5">다음 코칭 세션</div>
                <div className="font-black text-neutral-800">{s.nextSession.date}</div>
                <div className="text-sm text-neutral-500">{s.nextSession.topic}</div>
              </div>
              <Link href="/consultation" className="btn-accent text-xs px-4 py-2 flex-shrink-0">
                재예약하기
              </Link>
            </div>
          </div>
        )}

        {/* ── 탭 4: 코칭 기록 ── */}
        {activeTab === 'coaching' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-neutral-800">코칭 세션 기록</h3>
              <span className="text-xs text-neutral-400">총 {s.coachingSessions.length}회</span>
            </div>

            {s.coachingSessions.map(session => (
              <div key={session.id} className="card overflow-hidden">
                {/* 세션 헤더 */}
                <button
                  onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                  className="w-full px-5 py-4 flex items-center gap-3 hover:bg-neutral-50 transition text-left"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">
                    {session.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="font-bold text-sm text-neutral-800">{session.date}</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${sessionTypeColor[session.type]}`}>
                        {session.type}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500 truncate">{session.topic}</div>
                  </div>
                  <span className={`text-neutral-400 transition-transform duration-200 ${expandedSession === session.id ? 'rotate-180' : ''}`}>▾</span>
                </button>

                {/* 세션 상세 */}
                {expandedSession === session.id && (
                  <div className="border-t border-neutral-100 px-5 py-4 space-y-4 bg-neutral-50/50">
                    <div>
                      <div className="text-xs font-semibold text-neutral-500 mb-1.5 flex items-center gap-1.5">
                        <span>👩‍🏫</span> 담당 코치
                      </div>
                      <div className="text-sm font-semibold text-neutral-800">{session.coach}</div>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-neutral-500 mb-1.5 flex items-center gap-1.5">
                        <span>📝</span> 세션 요약
                      </div>
                      <p className="text-sm text-neutral-700 leading-relaxed">{session.summary}</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
                      <div className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-1.5">
                        <span>📌</span> 과제 (Homework)
                      </div>
                      <p className="text-sm text-amber-800">{session.homework}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span>📅 다음 세션 예정일:</span>
                      <span className="font-semibold text-primary-600">{session.nextDate}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <Link href="/consultation" className="btn-accent w-full text-center py-3.5">
              새 코칭 세션 신청하기 →
            </Link>
          </div>
        )}

        {/* ── 탭 5: 성장 추이 ── */}
        {activeTab === 'growth' && (
          <div className="space-y-5">
            <div className="card p-6">
              <h3 className="font-bold text-neutral-800 mb-1">월별 성장 점수 추이</h3>
              <p className="text-xs text-neutral-400 mb-3">최근 4개월 진단 결과</p>
              <MiniGrowthChart data={s.growthData} />

              {/* 성장량 표시 */}
              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs text-neutral-500">최초 대비 성장:</span>
                <span className="font-black text-primary-600 text-base">
                  +{s.growthData[s.growthData.length - 1].score - s.growthData[0].score}점
                </span>
                <span className="text-xs px-2 py-0.5 bg-primary-100 text-primary-700 rounded-full font-semibold">
                  {s.growthData[0].month} → {s.growthData[s.growthData.length - 1].month}
                </span>
              </div>
            </div>

            {/* 성장 하이라이트 */}
            <div className="card p-5 space-y-3">
              <h3 className="font-bold text-neutral-800 text-sm">성장 하이라이트</h3>
              {[
                { icon: '🏆', text: `${s.growthData[0].month} 대비 ${s.growthData[s.growthData.length-1].score - s.growthData[0].score}점 상승으로 지속적인 성장 중` },
                { icon: '📈', text: `현재 레벨: ${s.level} — 다음 목표까지 ${s.level === 'Excellence' ? '최고 레벨 유지 중' : s.level === 'Suitable' ? `${85 - s.score}점` : s.level === 'Basic' ? `${70 - s.score}점` : `${55 - s.score}점`} 필요` },
                { icon: '✅', text: `총 ${s.coachingSessions.length}회 코칭 세션 완료 · 꾸준한 참여가 성장의 핵심입니다` },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-neutral-700">
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <span className="leading-relaxed">{item.text}</span>
                </div>
              ))}
            </div>

            {/* 다음 진단 안내 */}
            <div className="bg-primary-50 border border-primary-200 rounded-2xl p-5 flex items-start gap-3">
              <span className="text-2xl">🔔</span>
              <div>
                <div className="font-bold text-primary-800 text-sm mb-1">다음 진단 권장 시기</div>
                <p className="text-sm text-primary-700">3개월 간격 정기 진단을 권장합니다. 정기적인 진단을 통해 성장 추이를 정확히 파악하고 맞춤 프로그램을 조정합니다.</p>
                <Link href="/diagnosis" className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-primary-600 hover:underline">
                  지금 재진단하기 →
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

/* ─── 관리자 뷰 ─── */
function AdminView({ onLogout }: { onLogout: () => void }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterLevel, setFilterLevel] = useState<string>('전체')

  const filtered = allStudents.filter(s => {
    const matchSearch = s.name.includes(searchTerm) || s.grade.includes(searchTerm) || s.coach.includes(searchTerm)
    const matchLevel  = filterLevel === '전체' || s.level === filterLevel
    return matchSearch && matchLevel
  })

  return (
    <div className="min-h-screen bg-neutral-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-neutral-900">관리자 대시보드</h1>
            <p className="text-sm text-neutral-500">SO멘토링연구소 전체 현황 · {new Date().toLocaleDateString('ko-KR')}</p>
          </div>
          <button onClick={onLogout} className="btn-ghost text-sm border border-neutral-200 rounded-xl px-4 py-2">로그아웃</button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {adminStats.map(s => (
            <div key={s.label} className="card p-5 text-center">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
              <div className="text-sm text-neutral-500 mt-0.5">{s.label}</div>
              <div className="text-xs text-neutral-400">{s.unit}</div>
            </div>
          ))}
        </div>

        {/* 이번 주 예정 코칭 */}
        <div className="card p-5 space-y-3">
          <h3 className="font-bold text-neutral-800 text-sm flex items-center gap-2">
            <span>📅</span> 이번 주 코칭 일정
          </h3>
          <div className="space-y-2">
            {allStudents.filter(s => s.nextSession <= '2026-09-15').slice(0, 3).map((s, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-neutral-50 last:border-0">
                <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">
                  {s.name[0]}
                </div>
                <div className="flex-1">
                  <span className="font-semibold text-sm text-neutral-800">{s.name}</span>
                  <span className="text-xs text-neutral-400 ml-2">{s.grade}</span>
                </div>
                <span className="text-xs text-neutral-500">{s.nextSession}</span>
                <span className="text-xs font-medium text-primary-600">{s.coach}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 검색 및 필터 */}
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="이름·학년·코치 검색..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input-base text-sm flex-1 min-w-[160px]"
          />
          <div className="flex gap-2">
            {['전체', 'Excellence', 'Suitable', 'Basic', 'Exploring'].map(level => (
              <button
                key={level}
                onClick={() => setFilterLevel(level)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition
                  ${filterLevel === level ? 'bg-primary-500 text-white' : 'bg-white border border-neutral-200 text-neutral-500 hover:border-primary-300'}`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* 학생 목록 */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="font-bold text-neutral-800">학생 목록 ({filtered.length}명)</h3>
            <span className="text-xs text-neutral-400">마지막 코칭 · 다음 코칭 · 담당 코치</span>
          </div>
          <div className="divide-y divide-neutral-50">
            {filtered.map((s, i) => (
              <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-neutral-50 transition">
                <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm flex-shrink-0">
                  {s.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-neutral-800 text-sm">{s.name}</div>
                  <div className="text-xs text-neutral-400">{s.grade}</div>
                </div>
                <div className="hidden sm:flex flex-col items-end text-xs text-neutral-400">
                  <span>마지막: {s.lastSession}</span>
                  <span className="text-primary-600 font-medium">다음: {s.nextSession}</span>
                </div>
                <div className="text-xs text-neutral-500 hidden md:block">{s.coach}</div>
                <span className={levelColor[s.level]}>{s.level}</span>
                <span className="font-bold text-primary-600 text-sm">{s.score}점</span>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-6 py-10 text-center text-neutral-300 text-sm">검색 결과가 없습니다</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ParentCoachingPage() {
  const [role, setRole] = useState<Role>('none')
  if (role === 'none')   return <LoginForm onLogin={setRole} />
  if (role === 'parent') return <ParentView onLogout={() => setRole('none')} />
  if (role === 'admin')  return <AdminView  onLogout={() => setRole('none')} />
  return null
}
