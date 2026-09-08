'use client'
import { useState } from 'react'
import Link from 'next/link'

/* =====================================================================
   타입 정의
===================================================================== */
type AreaScore = {
  name: string
  icon: string
  score: number    // 0~100
  maxScore: number
}

type DiagnosisRecord = {
  id: string
  childName: string
  responder: string
  relationship: string
  school: string
  schoolLevel: string
  date: string          // YYYY-MM-DD
  totalScore: number
  level: 'Excellence' | 'Suitable' | 'Basic' | 'Exploring'
  areas: AreaScore[]
  concerns: string[]
  email: string
  memo: string
}

/* =====================================================================
   레벨 정의
===================================================================== */
const LEVELS = {
  Excellence: { label: 'Excellence', icon: '🏆', color: 'text-primary-600', bg: 'bg-primary-50', border: 'border-primary-200', badge: 'bg-primary-100 text-primary-700' },
  Suitable:   { label: 'Suitable',   icon: '✅', color: 'text-primary-500', bg: 'bg-primary-50', border: 'border-primary-100', badge: 'bg-blue-100    text-blue-700'    },
  Basic:      { label: 'Basic',      icon: '📈', color: 'text-accent-600',  bg: 'bg-accent-50',  border: 'border-accent-200',  badge: 'bg-orange-100  text-orange-700'  },
  Exploring:  { label: 'Exploring',  icon: '🔍', color: 'text-neutral-600', bg: 'bg-neutral-50', border: 'border-neutral-200', badge: 'bg-neutral-100  text-neutral-600'  },
}

const AREA_COLORS = [
  'bg-primary-500', 'bg-accent-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500',
]

/* =====================================================================
   샘플 데이터 (개발1 방식 — 진단 기록 목록)
===================================================================== */
const SAMPLE_RECORDS: DiagnosisRecord[] = [
  {
    id: 'r001',
    childName: '김지훈',
    responder: '김영희',
    relationship: '어머니',
    school: '부천 상동초등학교',
    schoolLevel: '초등학교',
    date: '2026-08-20',
    totalScore: 82,
    level: 'Excellence',
    areas: [
      { name: '자기주도성',   icon: '🎯', score: 85, maxScore: 100 },
      { name: 'AI 활용 적합',  icon: '🤖', score: 90, maxScore: 100 },
      { name: '논리적 사고',  icon: '🧠', score: 78, maxScore: 100 },
      { name: '소통·표현',    icon: '💬', score: 80, maxScore: 100 },
      { name: '학부모 연계',  icon: '🤝', score: 75, maxScore: 100 },
    ],
    concerns: ['학습 집중력', '수학 성취'],
    email: 'kim@example.com',
    memo: '즉시 어울림토론 AI 시작 권장',
  },
  {
    id: 'r002',
    childName: '이수아',
    responder: '이철수',
    relationship: '아버지',
    school: '인천 연수중학교',
    schoolLevel: '중학교',
    date: '2026-08-25',
    totalScore: 67,
    level: 'Suitable',
    areas: [
      { name: '자기주도성',   icon: '🎯', score: 65, maxScore: 100 },
      { name: 'AI 활용 적합',  icon: '🤖', score: 72, maxScore: 100 },
      { name: '논리적 사고',  icon: '🧠', score: 60, maxScore: 100 },
      { name: '소통·표현',    icon: '💬', score: 70, maxScore: 100 },
      { name: '학부모 연계',  icon: '🤝', score: 68, maxScore: 100 },
    ],
    concerns: ['자기표현력', '진로 방향'],
    email: 'lee@example.com',
    memo: '어울림토론 AI부터 시작, 3개월 후 재진단',
  },
  {
    id: 'r003',
    childName: '박민준',
    responder: '박소연',
    relationship: '어머니',
    school: '서울 강남고등학교',
    schoolLevel: '고등학교',
    date: '2026-09-01',
    totalScore: 48,
    level: 'Basic',
    areas: [
      { name: '자기주도성',   icon: '🎯', score: 42, maxScore: 100 },
      { name: 'AI 활용 적합',  icon: '🤖', score: 55, maxScore: 100 },
      { name: '논리적 사고',  icon: '🧠', score: 50, maxScore: 100 },
      { name: '소통·표현',    icon: '💬', score: 45, maxScore: 100 },
      { name: '학부모 연계',  icon: '🤝', score: 50, maxScore: 100 },
    ],
    concerns: ['학습 동기 부족', '시간 관리', '스마트폰 과의존'],
    email: 'park@example.com',
    memo: '기초 루틴부터 설계 필요. 개인 상담 우선 권장',
  },
  {
    id: 'r004',
    childName: '최예린',
    responder: '최지영',
    relationship: '어머니',
    school: '부천 중동초등학교',
    schoolLevel: '초등학교',
    date: '2026-09-05',
    totalScore: 74,
    level: 'Suitable',
    areas: [
      { name: '자기주도성',   icon: '🎯', score: 78, maxScore: 100 },
      { name: 'AI 활용 적합',  icon: '🤖', score: 70, maxScore: 100 },
      { name: '논리적 사고',  icon: '🧠', score: 75, maxScore: 100 },
      { name: '소통·표현',    icon: '💬', score: 72, maxScore: 100 },
      { name: '학부모 연계',  icon: '🤝', score: 76, maxScore: 100 },
    ],
    concerns: ['글쓰기 역량'],
    email: 'choi@example.com',
    memo: '자기경영 + 토론 병행 시작 가능',
  },
  {
    id: 'r005',
    childName: '정태양',
    responder: '정은주',
    relationship: '어머니',
    school: '인천 부평중학교',
    schoolLevel: '중학교',
    date: '2026-09-06',
    totalScore: 32,
    level: 'Exploring',
    areas: [
      { name: '자기주도성',   icon: '🎯', score: 30, maxScore: 100 },
      { name: 'AI 활용 적합',  icon: '🤖', score: 38, maxScore: 100 },
      { name: '논리적 사고',  icon: '🧠', score: 35, maxScore: 100 },
      { name: '소통·표현',    icon: '💬', score: 28, maxScore: 100 },
      { name: '학부모 연계',  icon: '🤝', score: 30, maxScore: 100 },
    ],
    concerns: ['자신감 부족', '학교 거부감', '또래 관계'],
    email: 'jung@example.com',
    memo: '정서 지원 우선, 개인 상담 필수',
  },
]

/* =====================================================================
   미니 막대 그래프
===================================================================== */
function MiniBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-bold text-neutral-500 w-8 text-right">{score}</span>
    </div>
  )
}

/* =====================================================================
   방사형 스코어 카드 (SVG)
===================================================================== */
function RadarCard({ areas }: { areas: AreaScore[] }) {
  const N   = areas.length
  const R   = 70
  const CX  = 90, CY = 90
  const angleFn = (i: number) => (Math.PI * 2 * i) / N - Math.PI / 2

  const pointFn = (i: number, ratio: number) => {
    const a = angleFn(i)
    return { x: CX + R * ratio * Math.cos(a), y: CY + R * ratio * Math.sin(a) }
  }

  const bgPoly   = Array.from({ length: N }, (_, i) => pointFn(i, 1))
  const dataPoly = areas.map((a, i) => pointFn(i, a.score / 100))

  const toPath = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + ' Z'

  return (
    <svg viewBox="0 0 180 180" className="w-full max-w-[180px] mx-auto">
      {/* 배경 그리드 */}
      {[0.25, 0.5, 0.75, 1].map(r => (
        <polygon key={r} points={bgPoly.map(p => {
          const a = angleFn(bgPoly.indexOf(p))
          return `${(CX + R * r * Math.cos(a)).toFixed(1)},${(CY + R * r * Math.sin(a)).toFixed(1)}`
        }).join(' ')} fill="none" stroke="#e5e7eb" strokeWidth="0.8" />
      ))}
      {/* 축선 */}
      {Array.from({ length: N }, (_, i) => {
        const p = pointFn(i, 1)
        return <line key={i} x1={CX} y1={CY} x2={p.x.toFixed(1)} y2={p.y.toFixed(1)} stroke="#e5e7eb" strokeWidth="0.8" />
      })}
      {/* 데이터 영역 */}
      <path d={toPath(dataPoly)} fill="#1E4FD8" fillOpacity="0.2" stroke="#1E4FD8" strokeWidth="2" strokeLinejoin="round" />
      {/* 데이터 점 */}
      {dataPoly.map((p, i) => (
        <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="3" fill="#1E4FD8" />
      ))}
      {/* 축 레이블 */}
      {areas.map((a, i) => {
        const p = pointFn(i, 1.22)
        return (
          <text key={i} x={p.x.toFixed(1)} y={p.y.toFixed(1)}
            textAnchor="middle" dominantBaseline="middle"
            fontSize="7" fill="#6b7280" fontWeight="600">
            {a.icon}
          </text>
        )
      })}
    </svg>
  )
}

/* =====================================================================
   상세 모달
===================================================================== */
function DetailModal({ record, onClose }: { record: DiagnosisRecord; onClose: () => void }) {
  const lv = LEVELS[record.level]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}>

        {/* 헤더 */}
        <div className={`${lv.bg} border-b ${lv.border} px-6 py-5 flex items-start justify-between`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{lv.icon}</span>
              <span className={`font-black text-lg ${lv.color}`}>{record.childName} 진단 결과</span>
            </div>
            <div className="text-sm text-neutral-500">
              {record.responder} ({record.relationship}) · {record.school}
            </div>
            <div className="text-xs text-neutral-400 mt-0.5">{record.date}</div>
          </div>
          <button onClick={onClose} className="text-neutral-300 hover:text-neutral-600 text-2xl leading-none mt-1">×</button>
        </div>

        <div className="p-6 space-y-6">
          {/* 종합 점수 */}
          <div className="text-center">
            <div className={`text-5xl font-black ${lv.color}`}>{record.totalScore}</div>
            <div className="text-neutral-400 text-sm mt-1">종합 점수 / 100</div>
            <div className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-black ${lv.badge}`}>
              {lv.icon} {lv.label}
            </div>
          </div>

          {/* 레이더 + 영역 점수 */}
          <div className="grid grid-cols-2 gap-4">
            <RadarCard areas={record.areas} />
            <div className="space-y-2 flex flex-col justify-center">
              {record.areas.map((a, i) => (
                <div key={a.name}>
                  <div className="flex items-center gap-1 mb-0.5">
                    <span className="text-xs">{a.icon}</span>
                    <span className="text-xs font-semibold text-neutral-600">{a.name}</span>
                  </div>
                  <MiniBar score={a.score} color={AREA_COLORS[i % AREA_COLORS.length]} />
                </div>
              ))}
            </div>
          </div>

          {/* 주요 고민 */}
          {record.concerns.length > 0 && (
            <div>
              <h4 className="text-sm font-black text-neutral-700 mb-2">주요 고민</h4>
              <div className="flex gap-2 flex-wrap">
                {record.concerns.map(c => (
                  <span key={c} className="bg-accent-50 text-accent-700 border border-accent-200 rounded-full px-3 py-1 text-xs font-semibold">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 메모 */}
          {record.memo && (
            <div className="bg-primary-50 border border-primary-100 rounded-xl px-4 py-3">
              <div className="text-xs font-black text-primary-700 mb-1">📝 코치 메모</div>
              <div className="text-sm text-primary-800">{record.memo}</div>
            </div>
          )}

          {/* 연락처 */}
          <div className="flex items-center gap-2 text-xs text-neutral-400 border-t pt-4">
            <span>📧</span><span>{record.email}</span>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <Link href="/parent-coaching"
              className="flex-1 btn-primary text-center text-sm py-3 rounded-xl font-bold">
              코칭 기록 보기 →
            </Link>
            <Link href="/consultation"
              className="flex-1 border-2 border-primary-300 text-primary-600 text-center text-sm py-3 rounded-xl font-bold hover:bg-primary-50 transition">
              상담 신청 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

/* =====================================================================
   관리자 비밀번호 (변경하려면 이 값을 수정하세요)
===================================================================== */
const ADMIN_PASSWORD = 'so2024'

/* =====================================================================
   비밀번호 게이트 화면
===================================================================== */
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw]       = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      onUnlock()
    } else {
      setError(true)
      setShake(true)
      setPw('')
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <div className={`bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-neutral-100 ${shake ? 'animate-shake' : ''}`}>
        {/* 아이콘 */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-black text-primary-800">관리자 전용</h1>
          <p className="text-sm text-neutral-500 mt-1 text-center">진단 결과 열람은 관리자만 가능합니다</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">관리자 비밀번호</label>
            <input
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setError(false) }}
              placeholder="비밀번호를 입력하세요"
              autoFocus
              className={`w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all
                ${error
                  ? 'border-red-400 bg-red-50 focus:border-red-500'
                  : 'border-neutral-200 focus:border-primary-500 bg-neutral-50 focus:bg-white'
                }`}
            />
            {error && (
              <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                비밀번호가 올바르지 않습니다
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg"
          >
            확인
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-neutral-100 text-center">
          <Link href="/" className="text-xs text-neutral-400 hover:text-neutral-600 transition">
            ← 메인으로 돌아가기
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  )
}

/* =====================================================================
   메인 페이지
===================================================================== */
export default function DiagnosisRecordsPage() {
  const [unlocked, setUnlocked]   = useState(false)
  const [records]       = useState<DiagnosisRecord[]>(SAMPLE_RECORDS)
  const [selected, setSelected]   = useState<DiagnosisRecord | null>(null)
  const [search,   setSearch]     = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [sort,     setSort]       = useState<'date' | 'score'>('date')

  /* 비밀번호 미입력 시 게이트 표시 */
  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />

  /* 필터 + 정렬 */
  const filtered = records
    .filter(r =>
      (levelFilter === 'all' || r.level === levelFilter) &&
      (search === '' || r.childName.includes(search) || r.school.includes(search) || r.responder.includes(search))
    )
    .sort((a, b) => sort === 'date'
      ? b.date.localeCompare(a.date)
      : b.totalScore - a.totalScore
    )

  /* 통계 */
  const totalCnt   = records.length
  const avgScore   = Math.round(records.reduce((s, r) => s + r.totalScore, 0) / totalCnt)
  const excelCnt   = records.filter(r => r.level === 'Excellence').length
  const thisWeek   = records.filter(r => r.date >= '2026-09-01').length

  return (
    <div className="min-h-screen bg-neutral-50 pb-16">

      {/* ── 헤더 ── */}
      <div className="bg-gradient-to-br from-primary-700 to-primary-500 text-white px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-semibold mb-3">
            <span>📊</span><span>성장진단 결과 관리</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-1">진단 결과 조회</h1>
          <p className="text-white/70 text-sm mb-6">제출된 성장진단 결과를 확인하고 관리하세요</p>

          {/* 통계 뱃지 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: '전체 진단', value: `${totalCnt}건`, icon: '📋' },
              { label: '이번 주',   value: `${thisWeek}건`, icon: '📅' },
              { label: '평균 점수', value: `${avgScore}점`, icon: '📈' },
              { label: 'Excellence', value: `${excelCnt}명`, icon: '🏆' },
            ].map(s => (
              <div key={s.label} className="bg-white/15 rounded-xl px-4 py-3 text-center">
                <div className="text-xl mb-0.5">{s.icon}</div>
                <div className="text-xl font-black">{s.value}</div>
                <div className="text-white/70 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-6 space-y-4">

        {/* ── 검색 + 필터 ── */}
        <div className="card p-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="학생 이름, 학교, 보호자 검색..."
            className="input-base flex-1 text-sm"
          />
          <div className="flex gap-2 flex-wrap">
            {/* 레벨 필터 */}
            {['all', 'Excellence', 'Suitable', 'Basic', 'Exploring'].map(lv => (
              <button
                key={lv}
                onClick={() => setLevelFilter(lv)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all
                  ${levelFilter === lv
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-neutral-500 border-neutral-200 hover:border-neutral-400'}`}
              >
                {lv === 'all' ? '전체' : lv}
              </button>
            ))}
            {/* 정렬 */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value as 'date' | 'score')}
              className="input-base text-xs py-1.5 px-3"
            >
              <option value="date">최신 순</option>
              <option value="score">점수 높은 순</option>
            </select>
          </div>
        </div>

        {/* ── 결과 목록 ── */}
        {filtered.length === 0 ? (
          <div className="card p-12 text-center text-neutral-400">
            <div className="text-4xl mb-2">🔍</div>
            <div className="font-semibold">검색 결과가 없습니다</div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(r => {
              const lv = LEVELS[r.level]
              const maxArea  = r.areas.reduce((m, a) => a.score > m.score ? a : m, r.areas[0])
              const minArea  = r.areas.reduce((m, a) => a.score < m.score ? a : m, r.areas[0])
              return (
                <button
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className={`w-full card p-4 hover:shadow-card transition-all text-left border-l-4 ${lv.border} group`}
                >
                  <div className="flex items-start gap-4">
                    {/* 레이더 미니 */}
                    <div className="w-20 flex-shrink-0 hidden sm:block">
                      <RadarCard areas={r.areas} />
                    </div>

                    {/* 정보 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-black text-neutral-800 text-base">{r.childName}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${lv.badge}`}>
                          {lv.icon} {r.level}
                        </span>
                        <span className="text-xs text-neutral-400 ml-auto">{r.date}</span>
                      </div>

                      <div className="text-xs text-neutral-500 mb-2">
                        {r.responder} ({r.relationship}) · {r.school} ({r.schoolLevel})
                      </div>

                      {/* 종합 점수 바 */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-primary-500 transition-all"
                            style={{ width: `${r.totalScore}%` }} />
                        </div>
                        <span className={`text-sm font-black ${lv.color}`}>{r.totalScore}점</span>
                      </div>

                      {/* 강점/개선 */}
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2 py-0.5 font-semibold">
                          💚 강점: {maxArea.name} {maxArea.score}
                        </span>
                        <span className="text-[11px] bg-orange-50 text-orange-700 border border-orange-100 rounded-full px-2 py-0.5 font-semibold">
                          📌 개선: {minArea.name} {minArea.score}
                        </span>
                        {r.concerns.slice(0, 1).map(c => (
                          <span key={c} className="text-[11px] bg-neutral-50 text-neutral-500 border border-neutral-100 rounded-full px-2 py-0.5">
                            고민: {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 화살표 */}
                    <div className="text-neutral-200 group-hover:text-primary-400 transition text-xl flex-shrink-0 self-center">›</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* ── 새 진단 시작 버튼 ── */}
        <div className="card p-5 text-center border-dashed border-2 border-neutral-200 bg-white/50">
          <div className="text-2xl mb-2">➕</div>
          <p className="text-sm text-neutral-500 mb-3 font-semibold">새 학생의 성장진단을 시작하시겠어요?</p>
          <Link href="/diagnosis"
            className="btn-primary inline-block px-6 py-2.5 text-sm font-bold">
            성장진단 시작하기
          </Link>
        </div>
      </div>

      {/* ── 상세 모달 ── */}
      {selected && <DetailModal record={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
