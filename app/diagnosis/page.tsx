'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

/* ════════════════════════════════════════
   사전 설문 (인테이크) 데이터 타입
════════════════════════════════════════ */
type Relationship = 'mother' | 'father' | 'grandparent' | 'teacher' | 'other'
type SchoolLevel  = 'elementary' | 'middle' | 'high' | 'other'

type IntakeData = {
  // 1단계
  responderName: string
  childName: string
  schoolName: string
  schoolLevel: SchoolLevel | ''
  relationship: Relationship | ''
  // 2단계
  concerns: string[]
  // 3단계
  concernDuration: string
  currentPrograms: string[]
  studyHoursPerDay: string
  // 4단계
  email: string
  phone: string
  agreePrivacy: boolean
  agreeMarketing: boolean
}

const CONCERNS = [
  { id: 'motivation',  label: '학습 의욕·집중력 부족',    icon: '😔' },
  { id: 'grade',       label: '성적·학업 성취도 향상',     icon: '📉' },
  { id: 'selfstudy',  label: '자기주도 학습 습관 형성',   icon: '📚' },
  { id: 'career',      label: '진로·목표 설정',            icon: '🧭' },
  { id: 'social',      label: '교우 관계·사회성',          icon: '👥' },
  { id: 'emotion',     label: '정서·심리적 안정',          icon: '🧘' },
  { id: 'digital',     label: '스마트폰·게임 과의존',      icon: '📱' },
  { id: 'comm',        label: '학부모-자녀 소통',          icon: '💬' },
]

const DURATIONS = [
  { value: 'under1m',  label: '1개월 미만' },
  { value: '1to6m',    label: '1개월 ~ 6개월' },
  { value: '6mto1y',   label: '6개월 ~ 1년' },
  { value: 'over1y',   label: '1년 이상' },
]

const PROGRAMS = [
  { id: 'academy', label: '학원' },
  { id: 'private', label: '개인 과외' },
  { id: 'after',   label: '방과후 프로그램' },
  { id: 'online',  label: '온라인 강의' },
  { id: 'none',    label: '현재 없음' },
]

const STUDY_HOURS = [
  { value: 'under1',  label: '1시간 미만' },
  { value: '1to2',    label: '1~2시간' },
  { value: '2to3',    label: '2~3시간' },
  { value: 'over3',   label: '3시간 이상' },
]

const SCHOOL_LEVELS: { value: SchoolLevel; label: string }[] = [
  { value: 'elementary', label: '초등학교' },
  { value: 'middle',     label: '중학교' },
  { value: 'high',       label: '고등학교' },
  { value: 'other',      label: '기타' },
]

const RELATIONSHIPS: { value: Relationship; label: string }[] = [
  { value: 'mother',      label: '어머니' },
  { value: 'father',      label: '아버지' },
  { value: 'grandparent', label: '조부모' },
  { value: 'teacher',     label: '교사·강사' },
  { value: 'other',       label: '기타' },
]

/* ════════════════════════════════════════
   주관식 질문 5문항 (AI 분석 대상)
════════════════════════════════════════ */
const MIN_CHARS = 80  // 최소 글자 수

const subjectiveQuestions = [
  {
    id: 's1',
    tag: '학습 어려움',
    icon: '😔',
    text: '자녀(또는 본인)가 공부할 때 가장 힘든 점은 무엇이며, 그 이유는 무엇인가요?',
    hint: '구체적인 상황이나 과목, 감정 등을 포함해 상세히 작성해 주세요.',
    color: 'border-blue-300 focus:border-blue-500',
    tagColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 's2',
    tag: '강점 발견',
    icon: '💪',
    text: '자녀(또는 본인)의 가장 큰 장점은 무엇이며, 이를 학습에 어떻게 활용하고 싶으신가요?',
    hint: '일상에서 발견한 강점이나 잘하는 것, 좋아하는 것을 중심으로 적어주세요.',
    color: 'border-emerald-300 focus:border-emerald-500',
    tagColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 's3',
    tag: '성장 비전',
    icon: '🌟',
    text: '1년 후 자녀(또는 본인)가 어떤 모습으로 성장하길 바라시나요? 구체적으로 설명해 주세요.',
    hint: '학습, 성격, 관계, 진로 등 다양한 측면에서 구체적으로 작성해 주세요.',
    color: 'border-violet-300 focus:border-violet-500',
    tagColor: 'bg-violet-100 text-violet-700',
  },
  {
    id: 's4',
    tag: '학습 경험',
    icon: '📚',
    text: '지금까지 시도했던 학습 방법 중 효과가 있었던 것과 없었던 것은 무엇인가요?',
    hint: '어떤 방법이 왜 효과적이었는지, 혹은 왜 효과가 없었는지 이유도 함께 적어주세요.',
    color: 'border-amber-300 focus:border-amber-500',
    tagColor: 'bg-amber-100 text-amber-700',
  },
  {
    id: 's5',
    tag: '프로그램 기대',
    icon: '🤝',
    text: 'SO멘토링연구소 프로그램에서 가장 기대하는 것은 무엇인가요?',
    hint: '구체적인 목표나 변화, 기대하는 지원 등을 자유롭게 작성해 주세요.',
    color: 'border-rose-300 focus:border-rose-500',
    tagColor: 'bg-rose-100 text-rose-700',
  },
]

/* ════════════════════════════════════════
   AI 분석 엔진 (시뮬레이션)
════════════════════════════════════════ */
function analyzeSubjective(answers: Record<string, string>, childName: string): {
  summary: string; strengths: string[]; challenges: string[]; recommendations: string[]; aiScore: number
} {
  const totalChars = Object.values(answers).reduce((sum, v) => sum + v.length, 0)
  const richness   = Math.min(100, Math.round((totalChars / 2000) * 100))

  // 키워드 기반 패턴 분석
  const allText = Object.values(answers).join(' ')
  const hasSelfStudy  = /자기주도|스스로|계획|습관/.test(allText)
  const hasMotivation = /의욕|열정|좋아|즐거|재미/.test(allText)
  const hasStruggle   = /힘들|어렵|포기|싫|스트레스/.test(allText)
  const hasGoal       = /목표|꿈|장래|진로|대학|직업/.test(allText)
  const hasRelation   = /친구|관계|소통|함께|팀/.test(allText)

  const strengths: string[] = []
  const challenges: string[] = []
  const recommendations: string[] = []

  if (hasSelfStudy)  strengths.push('자기주도 학습 의지가 확인됩니다.')
  if (hasMotivation) strengths.push('학습에 대한 내재적 동기가 높습니다.')
  if (hasGoal)       strengths.push('명확한 목표 지향성을 보여주고 있습니다.')
  if (hasRelation)   strengths.push('관계 중심적 사고로 협력 학습에 적합합니다.')
  if (strengths.length === 0) strengths.push('성실하게 응답해 주신 점에서 진지한 태도가 보입니다.')

  if (hasStruggle)   challenges.push('학습 과정에서 정서적 어려움이 있어 지원이 필요합니다.')
  if (!hasSelfStudy) challenges.push('자기주도 학습 체계 수립이 우선 과제입니다.')
  if (!hasGoal)      challenges.push('구체적인 진로 목표 설정 작업이 필요합니다.')
  if (challenges.length === 0) challenges.push('전반적으로 균형 잡힌 성장 상태입니다.')

  recommendations.push('바로세움 6단계 프로그램을 통한 자기경영 역량 강화를 권장합니다.')
  if (hasStruggle)   recommendations.push('어울림토론 참여로 감정 표현 및 자기조절 능력을 기를 수 있습니다.')
  if (!hasGoal)      recommendations.push('진로 설계 코칭과 비전 수립 프로그램을 제안드립니다.')
  if (hasSelfStudy)  recommendations.push('자기주도 학습 실천생활 기록을 통해 습관을 체계화하세요.')
  recommendations.push('정기적인 성장 진단으로 변화를 추적하고 맞춤 피드백을 받으세요.')

  const aiScore = Math.min(100, Math.round(
    richness * 0.3 +
    (hasSelfStudy ? 15 : 0) +
    (hasMotivation ? 15 : 0) +
    (hasGoal ? 15 : 0) +
    (hasRelation ? 10 : 0) +
    15  // 기본 점수
  ))

  const name = childName || '학생'
  const summary = `${name} 학생의 주관식 응답을 AI가 분석한 결과, ` +
    `응답의 풍부함(${richness}점)과 내용의 구체성을 종합적으로 평가했습니다. ` +
    (hasSelfStudy ? '자기주도 학습에 대한 의지가 강하게 드러나며, ' : '') +
    (hasGoal ? '목표 지향적 사고가 돋보입니다. ' : '') +
    `AI 종합 역량 점수는 ${aiScore}점입니다.`

  return { summary, strengths, challenges, recommendations, aiScore }
}

/* ════════════════════════════════════════
   15문항 진단 데이터
════════════════════════════════════════ */
const questions = [
  // 학생 8문항
  { id: 1,  group: '학생',  axis: '학습성향',   brain: 'L', text: '나는 스스로 계획을 세워 공부하는 것을 좋아한다.' },
  { id: 2,  group: '학생',  axis: '학습성향',   brain: 'L', text: '나는 새로운 개념을 배울 때 여러 방법으로 이해하려고 시도한다.' },
  { id: 3,  group: '학생',  axis: '성격·기질',  brain: 'R', text: '나는 처음 만난 사람과도 쉽게 대화를 시작하는 편이다.' },
  { id: 4,  group: '학생',  axis: '성격·기질',  brain: 'R', text: '나는 실수했을 때 쉽게 좌절하지 않고 다시 시도한다.' },
  { id: 5,  group: '학생',  axis: '정서',       brain: 'R', text: '나는 화가 나거나 속상할 때 감정을 잘 조절하는 편이다.' },
  { id: 6,  group: '학생',  axis: '정서',       brain: 'R', text: '나는 요즘 학교나 학습에 대해 즐겁다고 느낀다.' },
  { id: 7,  group: '학생',  axis: '성장가능성', brain: 'L', text: '나는 어려운 문제를 만나도 포기하지 않고 끝까지 해보려 한다.' },
  { id: 8,  group: '학생',  axis: '성장가능성', brain: 'L', text: '나는 목표를 정하면 꾸준히 실천하려고 노력한다.' },
  // 학부모 7문항
  { id: 9,  group: '학부모', axis: '교육철학',     brain: 'L', text: '나는 아이의 자기주도성을 키우는 교육 방식을 중요하게 생각한다.' },
  { id: 10, group: '학부모', axis: '교육철학',     brain: 'L', text: '나는 성적보다 아이의 성장 과정과 태도를 더 중요하게 생각한다.' },
  { id: 11, group: '학부모', axis: '연구소 신뢰도', brain: 'R', text: '나는 SO멘토링연구소의 교육 철학과 프로그램에 신뢰를 느낀다.' },
  { id: 12, group: '학부모', axis: '연구소 신뢰도', brain: 'R', text: '나는 주변에 이 프로그램을 추천할 의향이 있다.' },
  { id: 13, group: '학부모', axis: '교육투자의지',  brain: 'L', text: '나는 자녀의 성장을 위한 교육 프로그램에 지속적으로 투자할 의향이 있다.' },
  { id: 14, group: '학부모', axis: '교육투자의지',  brain: 'L', text: '나는 정기적인 진단·상담·코칭 프로그램에 참여할 시간적 여유가 있다.' },
  { id: 15, group: '학부모', axis: '연구소 적합도', brain: 'R', text: '나는 우리 아이에게 지금 이 시기에 자기주도학습·토론 역량 강화가 필요하다고 생각한다.' },
]

const scaleLabels = ['전혀 그렇지 않다', '그렇지 않다', '보통이다', '그렇다', '매우 그렇다']

function calcScore(answers: Record<number, number>) {
  const axisAvg = (ids: number[]) => {
    const vals = ids.map(id => answers[id] ?? 3)
    return vals.reduce((a, b) => a + b, 0) / vals.length
  }
  const aiScore     = Math.round(((axisAvg([1,2]) + axisAvg([3,4])) / 2) * (30 / 5))
  const growthScore = Math.round(((axisAvg([5,6]) + axisAvg([7,8]) * 1.2) / 2.2) * (40 / 5))
  const engageScore = Math.round(((axisAvg([9,10]) + axisAvg([11,12]) + axisAvg([13,14]) + axisAvg([15]) * 1.2) / 4.2) * (30 / 5))
  const total = Math.min(100, aiScore + growthScore + engageScore)
  return { aiScore, growthScore, engageScore, total }
}

/* ════════════════════════════════════════
   공통 UI 컴포넌트
════════════════════════════════════════ */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1.5 rounded-full transition-all duration-300
          ${i < current ? 'bg-primary-500 flex-1' : i === current ? 'bg-primary-400 flex-[2]' : 'bg-neutral-200 flex-1'}`} />
      ))}
    </div>
  )
}

function SectionLabel({ step, label }: { step: number; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-hero-gradient flex items-center justify-center text-white font-black text-sm flex-shrink-0">
        {step}
      </div>
      <div>
        <div className="text-xs text-neutral-400 font-medium">STEP {step} / 4</div>
        <div className="font-black text-neutral-800 text-base">{label}</div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════
   사전 설문 단계별 컴포넌트
════════════════════════════════════════ */

/* ── 1단계: 기본 정보 ── */
function IntakeStep1({ data, onChange, onNext }: {
  data: IntakeData
  onChange: (key: keyof IntakeData, val: string) => void
  onNext: () => void
}) {
  const valid = data.responderName.trim() && data.childName.trim() && data.schoolLevel && data.relationship

  return (
    <div className="space-y-5">
      <SectionLabel step={1} label="기본 정보 입력" />

      {/* 응답자 이름 */}
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-neutral-700">
          응답자 이름 <span className="text-accent-500">*</span>
        </label>
        <input
          type="text"
          value={data.responderName}
          onChange={e => onChange('responderName', e.target.value)}
          placeholder="예) 김민지"
          className="input-base"
        />
      </div>

      {/* 자녀 이름 */}
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-neutral-700">
          자녀 이름 <span className="text-accent-500">*</span>
        </label>
        <input
          type="text"
          value={data.childName}
          onChange={e => onChange('childName', e.target.value)}
          placeholder="예) 김민준"
          className="input-base"
        />
      </div>

      {/* 대상 학교 (M1) */}
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-neutral-700">
          학교 구분 (M1) <span className="text-accent-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SCHOOL_LEVELS.map(s => (
            <button
              key={s.value}
              onClick={() => onChange('schoolLevel', s.value)}
              className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition-all
                ${data.schoolLevel === s.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-primary-300'}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 학교명 (선택) */}
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-neutral-700">
          학교명 <span className="text-neutral-400 font-normal text-xs">(선택)</span>
        </label>
        <input
          type="text"
          value={data.schoolName}
          onChange={e => onChange('schoolName', e.target.value)}
          placeholder="예) 부천초등학교, 부천중학교"
          className="input-base"
        />
      </div>

      {/* 응답자 관계 (M2) */}
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-neutral-700">
          응답자 관계 (M2) <span className="text-accent-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {RELATIONSHIPS.map(r => (
            <button
              key={r.value}
              onClick={() => onChange('relationship', r.value)}
              className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all
                ${data.relationship === r.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-primary-300'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        disabled={!valid}
        className={`w-full py-4 rounded-xl font-bold text-base transition-all
          ${valid ? 'btn-primary' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`}
      >
        다음 단계 →
      </button>
    </div>
  )
}

/* ── 2단계: 현재 고민 선택 ── */
function IntakeStep2({ data, onToggleConcern, onNext, onPrev }: {
  data: IntakeData
  onToggleConcern: (id: string) => void
  onNext: () => void
  onPrev: () => void
}) {
  const valid = data.concerns.length > 0

  return (
    <div className="space-y-5">
      <SectionLabel step={2} label="현재 가장 큰 고민" />
      <p className="text-sm text-neutral-500">해당하는 고민을 모두 선택해 주세요 (복수 선택 가능)</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {CONCERNS.map(c => {
          const selected = data.concerns.includes(c.id)
          return (
            <button
              key={c.id}
              onClick={() => onToggleConcern(c.id)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all
                ${selected
                  ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-card'
                  : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-300 hover:bg-neutral-50'}`}
            >
              <span className="text-xl flex-shrink-0">{c.icon}</span>
              <span className="text-sm font-semibold flex-1">{c.label}</span>
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                ${selected ? 'border-primary-500 bg-primary-500 text-white' : 'border-neutral-300'}`}>
                {selected && <span className="text-[10px]">✓</span>}
              </span>
            </button>
          )
        })}
      </div>

      {data.concerns.length > 0 && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl px-4 py-2.5 text-sm text-primary-700">
          <span className="font-semibold">{data.concerns.length}가지</span> 고민이 선택되었습니다
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onPrev} className="btn-ghost border border-neutral-200 px-6 py-3 rounded-xl flex-none">← 이전</button>
        <button
          onClick={onNext}
          disabled={!valid}
          className={`flex-1 py-3.5 rounded-xl font-bold transition-all
            ${valid ? 'btn-primary' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`}
        >
          다음 단계 →
        </button>
      </div>
    </div>
  )
}

/* ── 3단계: 고민 기간 및 학습 현황 ── */
function IntakeStep3({ data, onChange, onToggleProgram, onNext, onPrev }: {
  data: IntakeData
  onChange: (key: keyof IntakeData, val: string) => void
  onToggleProgram: (id: string) => void
  onNext: () => void
  onPrev: () => void
}) {
  const valid = data.concernDuration && data.studyHoursPerDay

  return (
    <div className="space-y-6">
      <SectionLabel step={3} label="고민 기간 및 학습 현황" />

      {/* 고민 지속 기간 */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-neutral-700">
          이 고민이 얼마나 지속되었나요? <span className="text-accent-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {DURATIONS.map(d => (
            <button
              key={d.value}
              onClick={() => onChange('concernDuration', d.value)}
              className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all
                ${data.concernDuration === d.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-primary-300'}`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* 현재 참여 프로그램 */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-neutral-700">
          현재 참여 중인 교육 프로그램 <span className="text-neutral-400 font-normal text-xs">(복수 선택 가능)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {PROGRAMS.map(p => {
            const selected = data.currentPrograms.includes(p.id)
            return (
              <button
                key={p.id}
                onClick={() => onToggleProgram(p.id)}
                className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all
                  ${selected
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:border-primary-300'}`}
              >
                {p.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* 하루 평균 학습 시간 */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-neutral-700">
          자녀의 하루 평균 학습 시간 <span className="text-accent-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STUDY_HOURS.map(h => (
            <button
              key={h.value}
              onClick={() => onChange('studyHoursPerDay', h.value)}
              className={`py-3 rounded-xl border-2 text-sm font-semibold transition-all
                ${data.studyHoursPerDay === h.value
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-primary-300'}`}
            >
              {h.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onPrev} className="btn-ghost border border-neutral-200 px-6 py-3 rounded-xl flex-none">← 이전</button>
        <button
          onClick={onNext}
          disabled={!valid}
          className={`flex-1 py-3.5 rounded-xl font-bold transition-all
            ${valid ? 'btn-primary' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`}
        >
          다음 단계 →
        </button>
      </div>
    </div>
  )
}

/* ── 4단계: 이메일 및 약관 동의 ── */
function IntakeStep4({ data, onChange, onToggleCheck, onStart, onPrev }: {
  data: IntakeData
  onChange: (key: keyof IntakeData, val: string) => void
  onToggleCheck: (key: 'agreePrivacy' | 'agreeMarketing') => void
  onStart: () => void
  onPrev: () => void
}) {
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  const valid = emailValid && data.agreePrivacy

  return (
    <div className="space-y-5">
      <SectionLabel step={4} label="연락처 및 약관 동의" />

      {/* 이메일 */}
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-neutral-700">
          이메일 주소 <span className="text-accent-500">*</span>
        </label>
        <input
          type="email"
          value={data.email}
          onChange={e => onChange('email', e.target.value)}
          placeholder="example@email.com"
          className={`input-base ${data.email && !emailValid ? 'border-accent-400 focus:ring-accent-300' : ''}`}
        />
        {data.email && !emailValid && (
          <p className="text-xs text-accent-600 mt-1">올바른 이메일 형식으로 입력해 주세요</p>
        )}
        <p className="text-xs text-neutral-400">진단 결과 및 맞춤 프로그램 안내를 이메일로 받으실 수 있습니다</p>
      </div>

      {/* 연락처 (선택) */}
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-neutral-700">
          연락처 <span className="text-neutral-400 font-normal text-xs">(선택)</span>
        </label>
        <input
          type="tel"
          value={data.phone}
          onChange={e => onChange('phone', e.target.value)}
          placeholder="010-0000-0000"
          className="input-base"
        />
      </div>

      {/* 약관 동의 */}
      <div className="space-y-3 border border-neutral-200 rounded-2xl p-4">
        <div className="text-sm font-bold text-neutral-700">약관 동의</div>

        {/* 필수: 개인정보 수집·이용 동의 */}
        <button
          onClick={() => onToggleCheck('agreePrivacy')}
          className="w-full flex items-start gap-3 text-left"
        >
          <span className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
            ${data.agreePrivacy ? 'border-primary-500 bg-primary-500 text-white' : 'border-neutral-300'}`}>
            {data.agreePrivacy && <span className="text-[11px]">✓</span>}
          </span>
          <div className="flex-1">
            <span className="text-sm font-semibold text-neutral-800">
              [필수] 개인정보 수집·이용 동의
            </span>
            <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
              수집 항목: 이름, 이메일, 연락처, 자녀 학교 정보 / 수집 목적: 진단 결과 제공, 맞춤 프로그램 안내 /
              보유 기간: 서비스 이용 종료 후 3년 / 동의 거부 시 진단 서비스 이용이 제한될 수 있습니다.
            </p>
          </div>
        </button>

        <div className="border-t border-neutral-100" />

        {/* 선택: 마케팅 정보 수신 동의 */}
        <button
          onClick={() => onToggleCheck('agreeMarketing')}
          className="w-full flex items-start gap-3 text-left"
        >
          <span className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
            ${data.agreeMarketing ? 'border-primary-500 bg-primary-500 text-white' : 'border-neutral-300'}`}>
            {data.agreeMarketing && <span className="text-[11px]">✓</span>}
          </span>
          <div className="flex-1">
            <span className="text-sm font-semibold text-neutral-700">
              [선택] 마케팅 정보 수신 동의
            </span>
            <p className="text-xs text-neutral-500 mt-0.5">
              SO멘토링연구소의 프로그램 소식, 캠프 모집 안내 등을 이메일로 받으실 수 있습니다.
            </p>
          </div>
        </button>
      </div>

      {/* 시작 안내 */}
      <div className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-600">
        <div className="font-semibold mb-1">📋 진단 시작 안내</div>
        <ul className="text-xs space-y-0.5 text-neutral-500">
          <li>• 학생 8문항 + 학부모 7문항 · 총 15문항</li>
          <li>• 소요 시간: 약 5분</li>
          <li>• 솔직한 응답이 정확한 결과로 이어집니다</li>
        </ul>
      </div>

      <div className="flex gap-3">
        <button onClick={onPrev} className="btn-ghost border border-neutral-200 px-6 py-3 rounded-xl flex-none">← 이전</button>
        <button
          onClick={onStart}
          disabled={!valid}
          className={`flex-1 py-4 rounded-xl font-bold text-base transition-all
            ${valid ? 'btn-accent' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`}
        >
          🎯 진단 시작하기
        </button>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════
   메인 페이지
════════════════════════════════════════ */
export default function DiagnosisPage() {
  const router = useRouter()

  // phase 상태 기계
  const [phase, setPhase] = useState<'intake' | 'diagnosis' | 'subjective' | 'analyzing' | 'ai_result'>('intake')
  const [intakeStep, setIntakeStep] = useState(1)           // 1~4
  const [intake, setIntake] = useState<IntakeData>({
    responderName: '', childName: '', schoolName: '', schoolLevel: '', relationship: '',
    concerns: [], concernDuration: '', currentPrograms: [], studyHoursPerDay: '',
    email: '', phone: '', agreePrivacy: false, agreeMarketing: false,
  })

  // 진단 문항 상태
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})

  // 주관식 상태
  const [subCurrent, setSubCurrent] = useState(0)
  const [subAnswers, setSubAnswers] = useState<Record<string, string>>({})
  const [aiAnalysis, setAiAnalysis] = useState<ReturnType<typeof analyzeSubjective> | null>(null)

  /* ── 인테이크 핸들러 ── */
  const handleIntakeChange = (key: keyof IntakeData, val: string) => {
    setIntake(prev => ({ ...prev, [key]: val }))
  }

  const handleToggleConcern = (id: string) => {
    setIntake(prev => ({
      ...prev,
      concerns: prev.concerns.includes(id)
        ? prev.concerns.filter(c => c !== id)
        : [...prev.concerns, id],
    }))
  }

  const handleToggleProgram = (id: string) => {
    setIntake(prev => ({
      ...prev,
      currentPrograms: prev.currentPrograms.includes(id)
        ? prev.currentPrograms.filter(p => p !== id)
        : [...prev.currentPrograms, id],
    }))
  }

  const handleToggleCheck = (key: 'agreePrivacy' | 'agreeMarketing') => {
    setIntake(prev => ({ ...prev, [key]: !prev[key] }))
  }

  /* ── 객관식 진단 핸들러 ── */
  const q = questions[current]
  const progress = (current / questions.length) * 100
  const answered = Object.keys(answers).length
  const isLast = current === questions.length - 1
  const hasAnswer = answers[q?.id] !== undefined

  const handleSelect = (val: number) => {
    setAnswers(prev => ({ ...prev, [q.id]: val }))
  }

  const handleNext = () => {
    if (!hasAnswer) return
    if (isLast) {
      // 객관식 완료 → 주관식으로 이동
      setPhase('subjective')
      setSubCurrent(0)
    } else {
      setCurrent(c => c + 1)
    }
  }

  const handlePrev = () => { if (current > 0) setCurrent(c => c - 1) }

  /* ── 주관식 핸들러 ── */
  const sq = subjectiveQuestions[subCurrent]
  const subAnswer = subAnswers[sq?.id] ?? ''
  const subCharCount = subAnswer.length
  const subValid = subCharCount >= MIN_CHARS
  const subIsLast = subCurrent === subjectiveQuestions.length - 1

  const handleSubNext = () => {
    if (!subValid) return
    if (subIsLast) {
      // AI 분석 시작
      setPhase('analyzing')
      setTimeout(() => {
        const result = analyzeSubjective(subAnswers, intake.childName)
        setAiAnalysis(result)
        setPhase('ai_result')
      }, 2800)
    } else {
      setSubCurrent(c => c + 1)
    }
  }

  const handleSubPrev = () => { if (subCurrent > 0) setSubCurrent(c => c - 1) }

  /* ── 최종 결과 이동 ── */
  const handleGoResult = () => {
    const scores = calcScore(answers)
    const params = new URLSearchParams({
      total:   String(scores.total),
      ai:      String(scores.aiScore),
      growth:  String(scores.growthScore),
      engage:  String(scores.engageScore),
      name:    intake.childName,
      email:   intake.email,
      aiSub:   String(aiAnalysis?.aiScore ?? 0),
    })
    router.push(`/diagnosis/result?${params}`)
  }

  /* ── 헤더 서브타이틀 계산 ── */
  const headerSub =
    phase === 'intake'     ? `사전 설문 ${intakeStep}단계 / 4단계 · 정확한 진단을 위해 기본 정보를 입력해 주세요` :
    phase === 'diagnosis'  ? '객관식 15문항 · 약 5분' :
    phase === 'subjective' ? `AI 주관식 분석 ${subCurrent + 1} / ${subjectiveQuestions.length} · 솔직하게 작성할수록 정확합니다` :
    phase === 'analyzing'  ? 'AI가 응답 내용을 분석하고 있습니다...' :
                             'AI 분석 완료 · 최종 결과를 확인하세요'

  /* ── 렌더링 ── */
  return (
    <div className="min-h-screen bg-neutral-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* ── 헤더 ── */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-black text-neutral-900">AI 성장 진단</h1>
          <p className="text-neutral-500 text-sm">{headerSub}</p>
        </div>

        {/* ── 인테이크 단계 ── */}
        {phase === 'intake' && (
          <div className="card p-6 space-y-6">
            <StepIndicator current={intakeStep - 1} total={4} />
            {intakeStep === 1 && (
              <IntakeStep1 data={intake} onChange={handleIntakeChange} onNext={() => setIntakeStep(2)} />
            )}
            {intakeStep === 2 && (
              <IntakeStep2 data={intake} onToggleConcern={handleToggleConcern} onNext={() => setIntakeStep(3)} onPrev={() => setIntakeStep(1)} />
            )}
            {intakeStep === 3 && (
              <IntakeStep3 data={intake} onChange={handleIntakeChange} onToggleProgram={handleToggleProgram} onNext={() => setIntakeStep(4)} onPrev={() => setIntakeStep(2)} />
            )}
            {intakeStep === 4 && (
              <IntakeStep4 data={intake} onChange={handleIntakeChange} onToggleCheck={handleToggleCheck} onStart={() => setPhase('diagnosis')} onPrev={() => setIntakeStep(3)} />
            )}
          </div>
        )}

        {/* ── 객관식 진단 단계 ── */}
        {phase === 'diagnosis' && q && (
          <>
            {/* 진행 카드 */}
            <div className="card p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-neutral-700">진행 현황
                  {intake.childName && <span className="text-neutral-400 font-normal ml-2">— {intake.childName}</span>}
                </span>
                <span className="font-bold text-primary-600">{answered} / {questions.length}</span>
              </div>
              <div className="score-bar-track h-2.5">
                <div className="score-bar-fill bg-primary-500 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex gap-4 text-xs text-neutral-400">
                <span className={`flex items-center gap-1 ${current < 8 ? 'text-primary-600 font-semibold' : ''}`}>
                  <span className={`w-2 h-2 rounded-full ${current < 8 ? 'bg-primary-500' : 'bg-neutral-300'}`} />
                  학생 문항 (1~8)
                </span>
                <span className={`flex items-center gap-1 ${current >= 8 ? 'text-accent-600 font-semibold' : ''}`}>
                  <span className={`w-2 h-2 rounded-full ${current >= 8 ? 'bg-accent-500' : 'bg-neutral-300'}`} />
                  학부모 문항 (9~15)
                </span>
              </div>
            </div>

            {/* 문항 카드 */}
            <div className="card p-7 space-y-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-hero-gradient flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    {q.id}
                  </div>
                  <div>
                    <span className={`badge text-xs ${q.group === '학생' ? 'badge-primary' : 'badge-accent'}`}>{q.group}</span>
                    <span className="ml-2 text-xs text-neutral-400">{q.axis}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
                    ${q.brain === 'L' ? 'bg-primary-100 text-primary-700' : 'bg-neutral-100 text-neutral-400'}`}>
                    <span className="text-xs">🧠</span> 좌뇌
                  </div>
                  <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
                    ${q.brain === 'R' ? 'bg-accent-100 text-accent-700' : 'bg-neutral-100 text-neutral-400'}`}>
                    <span className="text-xs">🧠</span> 우뇌
                  </div>
                </div>
              </div>
              <p className="text-lg font-semibold text-neutral-800 leading-relaxed">{q.text}</p>
              <div className="space-y-3">
                {[1,2,3,4,5].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleSelect(val)}
                    className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-xl border-2 text-left
                      transition-all duration-150 font-medium text-sm
                      ${answers[q.id] === val
                        ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-card'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-primary-300 hover:bg-primary-50/50'}`}
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                      ${answers[q.id] === val ? 'bg-primary-500 text-white' : 'bg-neutral-100 text-neutral-400'}`}>
                      {val}
                    </span>
                    <span>{scaleLabels[val - 1]}</span>
                    {answers[q.id] === val && <span className="ml-auto text-primary-500">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* 네비게이션 */}
            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                disabled={current === 0}
                className="btn-ghost flex-none disabled:opacity-30 disabled:cursor-not-allowed border border-neutral-200 px-6 py-3 rounded-xl"
              >
                ← 이전
              </button>
              <button
                onClick={handleNext}
                disabled={!hasAnswer}
                className={`flex-1 py-3.5 rounded-xl font-bold text-base transition-all duration-150
                  ${hasAnswer
                    ? isLast ? 'btn-accent' : 'btn-primary'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`}
              >
                {isLast ? '✍️ AI 주관식 분석으로 →' : `다음 문항 (${current + 1}/${questions.length}) →`}
              </button>
            </div>
            <p className="text-center text-xs text-neutral-400">
              * 솔직하게 응답할수록 더 정확한 결과를 얻을 수 있습니다
            </p>
          </>
        )}

        {/* ── 주관식 단계 ── */}
        {phase === 'subjective' && sq && (
          <>
            {/* 전체 진행 표시 */}
            <div className="card p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-neutral-700 flex items-center gap-2">
                  <span className="text-lg">🤖</span> AI 주관식 분석
                  {intake.childName && <span className="text-neutral-400 font-normal">— {intake.childName}</span>}
                </span>
                <span className="font-bold text-violet-600">{subCurrent + 1} / {subjectiveQuestions.length}</span>
              </div>
              <div className="score-bar-track h-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-600 transition-all duration-500"
                  style={{ width: `${((subCurrent + 1) / subjectiveQuestions.length) * 100}%` }}
                />
              </div>
              <p className="text-xs text-neutral-400">최소 {MIN_CHARS}자 이상 작성해 주세요 · AI가 분석하여 맞춤 성장 피드백을 제공합니다</p>
            </div>

            {/* 질문 카드 */}
            <div className={`card p-7 space-y-5 border-2 ${sq.color.split(' ')[0]}`}>
              {/* 태그 + 아이콘 */}
              <div className="flex items-center gap-3">
                <span className="text-3xl">{sq.icon}</span>
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${sq.tagColor}`}>
                    {sq.tag}
                  </span>
                  <div className="text-xs text-neutral-400 mt-0.5">질문 {subCurrent + 1} / {subjectiveQuestions.length}</div>
                </div>
              </div>

              {/* 질문 텍스트 */}
              <p className="text-lg font-bold text-neutral-800 leading-relaxed">{sq.text}</p>

              {/* 힌트 */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-2.5 text-xs text-neutral-500">
                💡 {sq.hint}
              </div>

              {/* 텍스트에어리어 */}
              <div className="space-y-2">
                <textarea
                  value={subAnswer}
                  onChange={e => setSubAnswers(prev => ({ ...prev, [sq.id]: e.target.value }))}
                  placeholder="여기에 자유롭게 작성해 주세요..."
                  rows={6}
                  className={`w-full resize-none rounded-xl border-2 px-4 py-3 text-sm text-neutral-800
                    placeholder:text-neutral-300 outline-none transition-all duration-150
                    ${sq.color}
                    ${subValid ? 'bg-white' : 'bg-neutral-50'}`}
                />
                {/* 글자 수 카운터 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-32 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${subValid ? 'bg-emerald-500' : 'bg-violet-400'}`}
                        style={{ width: `${Math.min(100, (subCharCount / MIN_CHARS) * 100)}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${subValid ? 'text-emerald-600' : 'text-violet-500'}`}>
                      {subCharCount} / {MIN_CHARS}자
                    </span>
                  </div>
                  {subValid
                    ? <span className="text-xs text-emerald-600 font-semibold">✓ 충분한 답변입니다</span>
                    : <span className="text-xs text-neutral-400">{MIN_CHARS - subCharCount}자 더 작성해 주세요</span>
                  }
                </div>
              </div>
            </div>

            {/* 네비게이션 */}
            <div className="flex gap-3">
              <button
                onClick={handleSubPrev}
                disabled={subCurrent === 0}
                className="btn-ghost flex-none disabled:opacity-30 disabled:cursor-not-allowed border border-neutral-200 px-6 py-3 rounded-xl"
              >
                ← 이전
              </button>
              <button
                onClick={handleSubNext}
                disabled={!subValid}
                className={`flex-1 py-3.5 rounded-xl font-bold text-base transition-all duration-150
                  ${subValid
                    ? subIsLast
                      ? 'bg-gradient-to-r from-violet-500 to-violet-700 text-white hover:from-violet-600 hover:to-violet-800 shadow-lg'
                      : 'btn-primary'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`}
              >
                {subIsLast ? '🤖 AI 분석 시작' : `다음 질문 (${subCurrent + 1}/${subjectiveQuestions.length}) →`}
              </button>
            </div>
          </>
        )}

        {/* ── AI 분석 중 ── */}
        {phase === 'analyzing' && (
          <div className="card p-12 flex flex-col items-center justify-center space-y-8 min-h-[400px]">
            {/* 애니메이션 아이콘 */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-400 to-violet-700 flex items-center justify-center shadow-xl">
                <span className="text-4xl animate-pulse">🤖</span>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-violet-300 animate-ping opacity-30" />
            </div>

            <div className="text-center space-y-3">
              <h2 className="text-xl font-black text-neutral-800">AI 분석 중...</h2>
              <p className="text-sm text-neutral-500 max-w-xs">
                {intake.childName || '학생'}님의 주관식 응답을 패턴 분석하고<br />
                맞춤형 성장 피드백을 생성하고 있습니다
              </p>
            </div>

            {/* 진행 인디케이터 */}
            <div className="w-full max-w-xs space-y-2">
              {['응답 텍스트 분석', '강점·과제 도출', '맞춤 추천안 생성'].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-violet-100 border-2 border-violet-400 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                  </div>
                  <span className="text-sm text-neutral-600">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── AI 분석 결과 ── */}
        {phase === 'ai_result' && aiAnalysis && (
          <>
            {/* AI 점수 배너 */}
            <div className="card p-6 bg-gradient-to-br from-violet-50 to-violet-100 border-2 border-violet-200 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🤖</span>
                <div>
                  <div className="text-xs text-violet-500 font-semibold">AI 주관식 분석 완료</div>
                  <div className="font-black text-violet-900 text-lg">{intake.childName || '학생'}님의 AI 역량 지수</div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-4xl font-black text-violet-700">{aiAnalysis.aiScore}</div>
                  <div className="text-xs text-violet-400">/ 100점</div>
                </div>
              </div>
              <div className="score-bar-track h-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-700 transition-all duration-1000"
                  style={{ width: `${aiAnalysis.aiScore}%` }}
                />
              </div>
            </div>

            {/* AI 종합 요약 */}
            <div className="card p-5 space-y-2">
              <div className="flex items-center gap-2 font-bold text-neutral-800">
                <span>📊</span> AI 종합 분석 요약
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed bg-neutral-50 rounded-xl p-4 border border-neutral-200">
                {aiAnalysis.summary}
              </p>
            </div>

            {/* 강점 / 과제 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card p-5 space-y-3 border-l-4 border-emerald-400">
                <div className="flex items-center gap-2 font-bold text-emerald-700">
                  <span>💪</span> 발견된 강점
                </div>
                <ul className="space-y-2">
                  {aiAnalysis.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                      <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card p-5 space-y-3 border-l-4 border-amber-400">
                <div className="flex items-center gap-2 font-bold text-amber-700">
                  <span>🎯</span> 성장 과제
                </div>
                <ul className="space-y-2">
                  {aiAnalysis.challenges.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                      <span className="text-amber-500 mt-0.5 flex-shrink-0">→</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 맞춤 추천 */}
            <div className="card p-5 space-y-3 border-l-4 border-violet-400">
              <div className="flex items-center gap-2 font-bold text-violet-700">
                <span>🌟</span> SO멘토링연구소 맞춤 추천
              </div>
              <ul className="space-y-2.5">
                {aiAnalysis.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-neutral-700">
                    <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-600 font-bold flex items-center justify-center text-xs flex-shrink-0 mt-0.5">{i + 1}</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 최종 결과 버튼 */}
            <button
              onClick={handleGoResult}
              className="w-full py-4 rounded-xl font-black text-base bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:from-primary-600 hover:to-accent-600 shadow-lg transition-all"
            >
              📊 객관식 + AI 주관식 통합 결과 보기 →
            </button>
            <p className="text-center text-xs text-neutral-400">
              * 객관식 15문항과 AI 주관식 5문항의 통합 분석 결과를 확인합니다
            </p>
          </>
        )}
      </div>
    </div>
  )
}
