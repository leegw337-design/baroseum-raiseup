'use client'
import { useState, useRef, useEffect } from 'react'

/* =====================================================================
   타입 정의
===================================================================== */
type Quadrant = 'do' | 'schedule' | 'delegate' | 'eliminate'
type GrowthArea = 'goal' | 'learn' | 'connect' | 'reflect' | 'act' | 'health'
type EvalMark = '○' | '/' | '—' | '△' | ''
type MainTab = 'today' | 'weekly' | 'reflection' | 'vision'
type AiMessage = { role: 'user' | 'ai'; text: string; time: string }

type Task = {
  id: number
  text: string
  quad: Quadrant
  area: GrowthArea | ''
  date: string
  person: string
  done: boolean
}

type TimeSlot = {
  time: string
  goal: string
  eval: EvalMark
  color: string
}

type WeeklyRow = {
  label: string
  goal: string
  practice: string
  check: string
  improve: string
}

type DailyCheck = {
  subject: string
  extracurricular: string
  etc: string
  goodRelation: string
  goodStudy: string
  goodEtc: string
}

type ReflectionNote = {
  title: string
  keyword: string
  content: string
  summary: string
}

type VisionRow = {
  label: string
  month1: string
  year1: string
  year5: string
  year10: string
}

/* =====================================================================
   상수 — 아이젠하워 매트릭스 4사분면
===================================================================== */
const QUADS: {
  key: Quadrant; label: string; sub: string; icon: string
  border: string; bg: string; header: string; dot: string; text: string
}[] = [
  { key: 'do',        label: '즉시 실행', sub: '중요 + 긴급',              icon: '🔥',
    border: 'border-accent-400',  bg: 'bg-accent-50',   header: 'bg-accent-500',   dot: 'bg-accent-500',   text: 'text-accent-600'   },
  { key: 'schedule',  label: '계획 수립', sub: '중요 + 여유',              icon: '📅',
    border: 'border-primary-400', bg: 'bg-primary-50',  header: 'bg-primary-500',  dot: 'bg-primary-500',  text: 'text-primary-600'  },
  { key: 'delegate',  label: '위임',      sub: '긴급 + 덜 중요',           icon: '🤝',
    border: 'border-amber-400',   bg: 'bg-amber-50',    header: 'bg-amber-500',    dot: 'bg-amber-500',    text: 'text-amber-600'    },
  { key: 'eliminate', label: '제거',      sub: '중요하지도 긴급하지도 않음', icon: '🗑️',
    border: 'border-neutral-300', bg: 'bg-neutral-50',  header: 'bg-neutral-400',  dot: 'bg-neutral-400',  text: 'text-neutral-500'  },
]

/* =====================================================================
   상수 — 바로세움 6대 성장영역 (특허 기반)
===================================================================== */
const GROWTH_AREAS: {
  key: GrowthArea; label: string; icon: string; desc: string
  chip: string; bg: string; text: string; bar: string
}[] = [
  { key: 'goal',    label: '목표설정', icon: '🎯', desc: '방향과 비전',
    chip: 'bg-violet-100 text-violet-700 border border-violet-200',
    bg: 'bg-violet-50',   text: 'text-violet-700',  bar: 'bg-violet-500'  },
  { key: 'learn',   label: '학습역량', icon: '📚', desc: '지식과 실력',
    chip: 'bg-blue-100 text-blue-700 border border-blue-200',
    bg: 'bg-blue-50',     text: 'text-blue-700',    bar: 'bg-blue-500'    },
  { key: 'connect', label: '소통관계', icon: '💬', desc: '관계와 협력',
    chip: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    bg: 'bg-emerald-50',  text: 'text-emerald-700', bar: 'bg-emerald-500' },
  { key: 'reflect', label: '자기성찰', icon: '🔍', desc: '이해와 통찰',
    chip: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
    bg: 'bg-indigo-50',   text: 'text-indigo-700',  bar: 'bg-indigo-500'  },
  { key: 'act',     label: '실천행동', icon: '⚡', desc: '행동과 습관',
    chip: 'bg-orange-100 text-orange-700 border border-orange-200',
    bg: 'bg-orange-50',   text: 'text-orange-700',  bar: 'bg-orange-500'  },
  { key: 'health',  label: '심신건강', icon: '❤️', desc: '몸과 마음',
    chip: 'bg-rose-100 text-rose-700 border border-rose-200',
    bg: 'bg-rose-50',     text: 'text-rose-700',    bar: 'bg-rose-500'    },
]

/* =====================================================================
   시간표 초기값 (6:00 ~ 23:00)
===================================================================== */
function makeTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = []
  const colors: Record<string, string> = {
    '6':'bg-white','7':'bg-white','8':'bg-white',
    '9':'bg-blue-50','10':'bg-blue-50','11':'bg-blue-50',
    '12':'bg-white',
    '13':'bg-yellow-50','14':'bg-yellow-50','15':'bg-yellow-50','16':'bg-yellow-50',
    '17':'bg-yellow-50','18':'bg-yellow-50',
    '19':'bg-white','20':'bg-white',
    '21':'bg-pink-50','22':'bg-pink-50','23':'bg-pink-50',
  }
  for (let h = 6; h <= 23; h++) {
    slots.push({ time: `${h}:00`, goal: '', eval: '', color: colors[String(h)] ?? 'bg-white' })
  }
  return slots
}

/* =====================================================================
   AI 대화 분석 헬퍼
===================================================================== */
function getQuadFromText(text: string): Quadrant {
  const hasUrgent    = /오늘|급히|빨리|당장|마감|곧|지금|즉시|바로|긴급|오전|오후|\d+시/.test(text)
  const hasImportant = /중요|필수|꼭|반드시|핵심|주요|중점|학습|공부|코칭|영어|수학|과학|국어|독서|운동|건강|업무|회의|보고|프로젝트|목표|계획|준비|발표|시험|훈련|과제|숙제|연구|강의|수업|멘토|피드백/.test(text)
  const hasSocial    = /친구|만남|약속|미팅|가족|모임|데이트|식사|저녁|점심|커피/.test(text)
  const isWaste      = /SNS|유튜브|게임|웹툰|드라마|넷플릭스|쇼핑|불필요|시간낭비/.test(text)
  if (isWaste)                   return 'eliminate'
  if (hasUrgent && hasImportant) return 'do'
  if (hasImportant)              return 'schedule'
  if (hasUrgent || hasSocial)    return 'delegate'
  return 'schedule'
}

function generateAiReply(userText: string): string {
  const hasUrgent    = /오늘|급히|빨리|당장|마감|곧|지금|즉시|바로/.test(userText)
  const hasImportant = /중요|필수|꼭|반드시|핵심|주요|중점/.test(userText)
  const hasTask      = /해야|해야겠|할 것|하고 싶|하기로|예정|계획/.test(userText)
  const hasGoal      = /목표|꿈|비전|되고싶|싶다|하고 싶/.test(userText)

  if (hasUrgent && hasImportant)
    return '🔥 **즉시 실행** 영역에 배치할게요! 긴급하고 중요한 일이므로 오늘 최우선으로 처리하세요. "AI 배치" 버튼을 눌러 자동 배치해보세요.'
  if (hasImportant && !hasUrgent)
    return '📅 **계획 수립** 영역이 적합해요. 중요하지만 급하지 않으니 차근차근 계획을 세워 실천하세요. "AI 배치"로 배치해볼 수 있어요!'
  if (hasUrgent && !hasImportant)
    return '🤝 **위임** 또는 **빠른 처리** 영역이에요. 급하지만 핵심 목표와 거리가 있다면 위임을 고려해보세요. "AI 배치"로 확인해보세요!'
  if (hasTask)
    return '📝 할 일을 파악했어요. 아래 **"AI 배치"** 버튼을 누르면 중요도·긴급도 분석 후 아이젠하워 매트릭스에 자동으로 배치해 드려요!'
  if (hasGoal)
    return '🌟 멋진 목표네요! 목표를 달성하기 위해 구체적으로 해야 할 일들을 알려주시면 우선순위를 잡아드릴게요.'
  return '💬 알겠습니다! 오늘 해야 할 일, 중요한 계획, 급한 일정 등을 자유롭게 말씀해 주세요. AI가 분석해서 아이젠하워 매트릭스에 배치해 드릴게요. 😊'
}

function nowTime(): string {
  return new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

/* =====================================================================
   초기 데이터
===================================================================== */
let nextId = 20
function today() { return new Date().toISOString().slice(0, 10) }

const INIT_TASKS: Task[] = [
  { id: 1,  text: '수학 시험 준비',       quad: 'do',        area: 'learn',   date: today(), person: '본인',   done: false },
  { id: 2,  text: '독서 목표 설정',       quad: 'schedule',  area: 'goal',    date: '',      person: '',       done: false },
  { id: 3,  text: '부모님 심부름',        quad: 'delegate',  area: 'connect', date: today(), person: '부모님', done: false },
  { id: 4,  text: '불필요한 SNS 줄이기',  quad: 'eliminate', area: 'health',  date: '',      person: '',       done: false },
  { id: 5,  text: '어울림토론 주제 연구', quad: 'schedule',  area: 'reflect', date: '',      person: '',       done: false },
]

const INIT_WEEKLY: WeeklyRow[] = [
  { label: '학습',        goal: '', practice: '', check: '', improve: '' },
  { label: '수행평가',    goal: '', practice: '', check: '', improve: '' },
  { label: '학습외 활동', goal: '', practice: '', check: '', improve: '' },
  { label: '기타',        goal: '', practice: '', check: '', improve: '' },
]

const INIT_VISION: VisionRow[] = [
  { label: '학습',        month1: '', year1: '', year5: '', year10: '' },
  { label: '수행평가',    month1: '', year1: '', year5: '', year10: '' },
  { label: '학습외 활동', month1: '', year1: '', year5: '', year10: '' },
  { label: '기타',        month1: '', year1: '', year5: '', year10: '' },
]

const INIT_AI_MESSAGES: AiMessage[] = [{
  role: 'ai',
  text: '안녕하세요! 오늘 하루를 함께 계획해 볼게요. 해야 할 일이나 일정을 자유롭게 말씀해 주시면 중요도·긴급도를 분석해 아이젠하워 매트릭스에 자동 배치해 드려요. 😊',
  time: nowTime(),
}]

/* =====================================================================
   메인 페이지
===================================================================== */
export default function SelfManagementPage() {
  const [mainTab, setMainTab] = useState<MainTab>('today')

  // ── 오늘 탭 상태
  const [todayGoal,      setTodayGoal]      = useState('')
  const [todayImportant, setTodayImportant] = useState('')
  const [mediaTime,      setMediaTime]      = useState('')
  const [timeSlots,      setTimeSlots]      = useState<TimeSlot[]>(makeTimeSlots)
  const [reflection,     setReflection]     = useState({ good: '', regret: '', tomorrow: '', gratitude: '' })

  // ── 아이젠하워 매트릭스 상태
  const [tasks,       setTasks]       = useState<Task[]>(INIT_TASKS)
  const [inputText,   setInputText]   = useState('')
  const [inputArea,   setInputArea]   = useState<GrowthArea | ''>('')
  const [inputDate,   setInputDate]   = useState('')
  const [inputPerson, setInputPerson] = useState('')

  // ── 드래그앤드롭 상태
  const [draggingId,   setDraggingId]   = useState<number | null>(null)
  const [draggingSlot, setDraggingSlot] = useState<number | null>(null)

  // ── AI 대화 상태
  const [aiMessages, setAiMessages] = useState<AiMessage[]>(INIT_AI_MESSAGES)
  const [aiInput,    setAiInput]    = useState('')
  const [aiTyping,   setAiTyping]   = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  // ── 주간 점검 상태
  const [weeklyDate, setWeeklyDate] = useState('')
  const [weeklyRows, setWeeklyRows] = useState<WeeklyRow[]>(INIT_WEEKLY)

  // ── 일일 점검 상태
  const [dailyCheck, setDailyCheck] = useState<DailyCheck>({
    subject: '', extracurricular: '', etc: '',
    goodRelation: '', goodStudy: '', goodEtc: ''
  })

  // ── 자아성찰노트
  const [noteList,    setNoteList]    = useState<ReflectionNote[]>([])
  const [noteForm,    setNoteForm]    = useState<ReflectionNote>({ title: '', keyword: '', content: '', summary: '' })
  const [editingNote, setEditingNote] = useState<number | null>(null)

  // ── 비전 상태
  const [visionDate, setVisionDate] = useState('')
  const [visionRows, setVisionRows] = useState<VisionRow[]>(INIT_VISION)

  // 채팅 스크롤
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiMessages, aiTyping])

  /* ── 아이젠하워 매트릭스 helpers ── */
  function addTask(quad: Quadrant) {
    if (!inputText.trim()) return
    setTasks(prev => [...prev, {
      id: ++nextId, text: inputText.trim(), quad,
      area: inputArea, date: inputDate, person: inputPerson, done: false
    }])
    setInputText(''); setInputArea(''); setInputDate(''); setInputPerson('')
  }
  function toggleTask(id: number) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }
  function removeTask(id: number) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  /* ── 드래그앤드롭 handlers ── */
  function handleDragStart(id: number) { setDraggingId(id) }
  function handleDragOver(e: React.DragEvent) { e.preventDefault() }
  function handleDrop(quad: Quadrant) {
    if (draggingId === null) return
    setTasks(prev => prev.map(t => t.id === draggingId ? { ...t, quad } : t))
    setDraggingId(null)
  }

  /* ── AI 대화 handlers ── */
  function sendAiMessage() {
    const text = aiInput.trim()
    if (!text || aiTyping) return
    const userMsg: AiMessage = { role: 'user', text, time: nowTime() }
    setAiMessages(prev => [...prev, userMsg])
    setAiInput('')
    setAiTyping(true)
    setTimeout(() => {
      const reply = generateAiReply(text)
      setAiMessages(prev => [...prev, { role: 'ai', text: reply, time: nowTime() }])
      setAiTyping(false)
    }, 900)
  }

  /* ── 한 문장에서 시간+활동 쌍을 모두 추출 ── */
  function parseTimedTasks(text: string): { hour: number; label: string }[] {
    const results: { hour: number; label: string }[] = []
    const timeRegex = /(오전|오후)?\s*(\d{1,2})시/g
    const matches: { index: number; end: number; hour: number }[] = []
    let m: RegExpExecArray | null
    while ((m = timeRegex.exec(text)) !== null) {
      let h = parseInt(m[2])
      if (m[1] === '오후' && h < 12) h += 12
      if (h >= 6 && h <= 23) matches.push({ index: m.index, end: m.index + m[0].length, hour: h })
    }
    matches.forEach((match, i) => {
      const nextIdx = i + 1 < matches.length ? matches[i + 1].index : text.length
      let activity = text.slice(match.end, nextIdx)
        .replace(/^[에는이가은을에는\s]+/, '')
        .replace(/있고|이고|있어|있습니다|예정이야|예정입니다|할\s*거야|할게요|할\s*것|이\s*있어/g, '')
        .replace(/[,，、。\s]+$/, '')
        .trim()
      if (activity.length > 1) results.push({ hour: match.hour, label: activity.slice(0, 20) })
    })
    return results
  }

  /* ── 단순 시간 추출 (단일 언급용) ── */
  function extractHour(text: string): number | null {
    const r = /(오전|오후)?\s*(\d{1,2})시/.exec(text)
    if (!r) return null
    let h = parseInt(r[2])
    if (r[1] === '오후' && h < 12) h += 12
    return h >= 6 && h <= 23 ? h : null
  }

  function analyzeAndPlaceTasks() {
    const userTexts = aiMessages.filter(m => m.role === 'user').map(m => m.text)
    if (userTexts.length === 0) return
    const newTasks: Task[] = []
    const slotUpdates: { hour: number; label: string }[] = []

    userTexts.forEach(text => {
      // ① 한 문장 안에 시간+활동이 여러 개 있으면 각각 분리 추출
      const timedPairs = parseTimedTasks(text)
      if (timedPairs.length > 1) {
        timedPairs.forEach(({ hour, label }) => {
          const taskText = `${hour < 12 ? '오전' : '오후'} ${hour <= 12 ? hour : hour - 12}시 ${label}`
          newTasks.push({
            id: ++nextId,
            text: taskText.slice(0, 45),
            quad: getQuadFromText(taskText),
            area: '', date: today(), person: '', done: false,
          })
          slotUpdates.push({ hour, label })
        })
        return  // 이 문장은 timedPairs로 처리 완료
      }

      // ② 단일 시간이거나 시간 없는 경우 → 기존 방식(쉼표/줄바꿈 분리)
      const items = text.split(/[,，、\n。]/).map(s => s.trim()).filter(s => s.length > 2)
      items.forEach(item => {
        const cleaned = item.replace(/^[•·\-]\s*/, '').slice(0, 45)
        if (!cleaned) return
        newTasks.push({
          id: ++nextId,
          text: cleaned,
          quad: getQuadFromText(cleaned),
          area: '', date: today(), person: '', done: false,
        })
        const hour = extractHour(cleaned)
        if (hour !== null) {
          const label = cleaned.replace(/(오전|오후)?\s*\d{1,2}시\s*/g, '').trim() || cleaned
          slotUpdates.push({ hour, label: label.slice(0, 20) })
        }
      })
    })

    if (newTasks.length === 0) {
      setAiMessages(prev => [...prev, {
        role: 'ai',
        text: '😅 배치할 할 일을 찾지 못했어요. 구체적인 할 일(예: "오전 10시 영어수업, 오후 2시 수학수업")을 입력해 주세요!',
        time: nowTime(),
      }])
      return
    }

    setTasks(prev => [...prev, ...newTasks])

    if (slotUpdates.length > 0) {
      setTimeSlots(prev => {
        const next = [...prev]
        slotUpdates.forEach(({ hour, label }) => {
          const idx = next.findIndex(s => s.time === `${hour}:00`)
          if (idx !== -1 && !next[idx].goal) {
            next[idx] = { ...next[idx], goal: label }
          }
        })
        return next
      })
    }

    const timetableMsg = slotUpdates.length > 0
      ? ` 시간이 언급된 ${slotUpdates.length}개 항목은 시간표에도 자동 입력됐어요! 📋`
      : ''
    setAiMessages(prev => [...prev, {
      role: 'ai',
      text: `✅ ${newTasks.length}개의 할 일을 아이젠하워 매트릭스에 자동 배치했어요!${timetableMsg} 드래그앤드롭으로 위치를 조정할 수도 있어요. 🎯`,
      time: nowTime(),
    }])
  }

  /* ── 시간표 eval 헬퍼 ── */
  const evalMarks: EvalMark[] = ['○', '/', '—', '△', '']
  const evalLabels: Record<string, string> = { '○': '완료', '/': '진행', '—': '중지', '△': '미룸', '': '-' }
  function updateSlot(idx: number, field: 'goal' | 'eval', value: string) {
    setTimeSlots(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s))
  }

  function handleSlotDragStart(idx: number) { setDraggingSlot(idx) }
  function handleSlotDragOver(e: React.DragEvent) { e.preventDefault() }
  function handleSlotDrop(targetIdx: number) {
    if (draggingSlot === null || draggingSlot === targetIdx) return
    setTimeSlots(prev => {
      const next = [...prev]
      const srcGoal = next[draggingSlot].goal
      const srcEval = next[draggingSlot].eval
      next[draggingSlot] = { ...next[draggingSlot], goal: next[targetIdx].goal, eval: next[targetIdx].eval }
      next[targetIdx]    = { ...next[targetIdx],    goal: srcGoal, eval: srcEval }
      return next
    })
    setDraggingSlot(null)
  }

  /* ── 주간 row 헬퍼 ── */
  function updateWeekly(idx: number, field: keyof WeeklyRow, value: string) {
    setWeeklyRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r))
  }

  /* ── 비전 row 헬퍼 ── */
  function updateVision(idx: number, field: keyof VisionRow, value: string) {
    setVisionRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r))
  }

  /* ── 성찰노트 헬퍼 ── */
  function saveNote() {
    if (!noteForm.title.trim()) return
    if (editingNote !== null) {
      setNoteList(prev => prev.map((n, i) => i === editingNote ? noteForm : n))
      setEditingNote(null)
    } else {
      setNoteList(prev => [...prev, noteForm])
    }
    setNoteForm({ title: '', keyword: '', content: '', summary: '' })
  }

  /* ── 성장영역별 통계 ── */
  const areaCounts = GROWTH_AREAS.map(a => ({
    ...a,
    total: tasks.filter(t => t.area === a.key).length,
    done:  tasks.filter(t => t.area === a.key && t.done).length,
  }))

  /* =====================================================================
     UI
  ===================================================================== */
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* ── 헤더 ── */}
      <section className="bg-white/90 backdrop-blur border-b border-neutral-100 py-8">
        <div className="section-wrap">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500
                            flex items-center justify-center text-white text-lg shadow-md">📋</div>
            <div>
              <h1 className="text-2xl font-black text-primary-800">자기경영</h1>
              <p className="text-sm text-neutral-500">자기주도학습 실천생활 · SO멘토링연구소 특허</p>
            </div>
          </div>
          {/* 탭 */}
          <div className="flex gap-1 mt-5 overflow-x-auto">
            {([
              { key: 'today',      label: '📅 오늘의 약속'  },
              { key: 'weekly',     label: '📊 주간 점검'     },
              { key: 'reflection', label: '🔍 성찰노트'     },
              { key: 'vision',     label: '🌟 비전과 꿈'    },
            ] as { key: MainTab; label: string }[]).map(t => (
              <button
                key={t.key}
                onClick={() => setMainTab(t.key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all
                  ${mainTab === t.key
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'bg-white text-neutral-600 hover:bg-primary-50 border border-neutral-200'}`}
              >{t.label}</button>
            ))}
          </div>
        </div>
      </section>

      <div className="section-wrap py-8 space-y-8">

        {/* ================================================================
            탭1: 오늘의 약속
        ================================================================ */}
        {mainTab === 'today' && (<>

          {/* ── 오늘의 목표 카드 ── */}
          <div className="bg-white rounded-2xl shadow-card border border-neutral-100 p-6">
            <h2 className="text-lg font-black text-primary-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center text-sm">🎯</span>
              하루의 약속
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1.5 block">
                  오늘의 목표 (중심어·핵심어)
                </label>
                <input
                  value={todayGoal}
                  onChange={e => setTodayGoal(e.target.value)}
                  placeholder="오늘 내가 이루고 싶은 목표를 적어주세요"
                  className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200
                             focus:border-primary-500 outline-none text-sm bg-neutral-50 focus:bg-white transition"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1.5 block">
                  오늘 꼭 해야 할 중요한 일
                </label>
                <input
                  value={todayImportant}
                  onChange={e => setTodayImportant(e.target.value)}
                  placeholder="오늘 반드시 완료해야 할 핵심 과제"
                  className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200
                             focus:border-accent-400 outline-none text-sm bg-neutral-50 focus:bg-white transition"
                />
              </div>
            </div>
            {/* 평가방법 범례 */}
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-neutral-500">
              <span className="font-semibold text-neutral-700">평가방법:</span>
              {[['○','완료','text-emerald-600 font-bold'], ['/','진행','text-blue-600 font-bold'],
                ['—','중지','text-red-500 font-bold'], ['△','미룸','text-amber-600 font-bold']].map(([m, l, cls]) => (
                <span key={m} className="flex items-center gap-1">
                  <span className={cls as string}>{m}</span> {l}
                </span>
              ))}
            </div>
          </div>

          {/* ── 시간표 + AI 대화창 (좌/우 분할) ── */}
          <div className="flex flex-col lg:flex-row gap-5">

            {/* 좌측: 시간표 */}
            <div className="bg-white rounded-2xl shadow-card border border-neutral-100 p-5 lg:w-1/2">
              <h2 className="text-base font-black text-primary-800 mb-1 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-sm">⏰</span>
                시간표
              </h2>
              <p className="text-xs text-neutral-400 mb-3">
                <span className="inline-block w-3 h-3 rounded bg-blue-100 mr-1"/>오전(9~11시)&nbsp;
                <span className="inline-block w-3 h-3 rounded bg-yellow-100 mr-1"/>오후(13~18시)&nbsp;
                <span className="inline-block w-3 h-3 rounded bg-pink-100 mr-1"/>저녁(21~23시)
              </p>
              <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
                <table className="w-full text-sm min-w-[320px]">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="border-b-2 border-neutral-200">
                      <th className="py-2 px-2 text-left text-xs font-bold text-neutral-500 w-14">시간</th>
                      <th className="py-2 px-2 text-left text-xs font-bold text-neutral-500">활동</th>
                      <th className="py-2 px-2 text-center text-xs font-bold text-neutral-500 w-16">평가</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((slot, idx) => (
                      <tr
                        key={slot.time}
                        draggable={!!slot.goal}
                        onDragStart={() => handleSlotDragStart(idx)}
                        onDragOver={handleSlotDragOver}
                        onDrop={() => handleSlotDrop(idx)}
                        onDragEnd={() => setDraggingSlot(null)}
                        className={`border-b border-neutral-100 ${slot.color} transition-all
                          ${draggingSlot === idx ? 'opacity-40 scale-95' : ''}
                          ${slot.goal ? 'cursor-grab active:cursor-grabbing' : ''}`}
                      >
                        <td className="py-1 px-2 text-xs font-bold text-neutral-500">{slot.time}</td>
                        <td className="py-1 px-1">
                          <input
                            value={slot.goal}
                            onChange={e => updateSlot(idx, 'goal', e.target.value)}
                            className="w-full px-2 py-1 text-xs bg-transparent outline-none
                                       border-b border-transparent focus:border-primary-300 transition"
                          />
                        </td>
                        <td className="py-1 px-1 text-center">
                          <select
                            value={slot.eval}
                            onChange={e => updateSlot(idx, 'eval', e.target.value as EvalMark)}
                            className="text-xs bg-transparent outline-none cursor-pointer w-full"
                          >
                            {evalMarks.map(m => (
                              <option key={m} value={m} disabled={m === ''} hidden={m === ''}>{`${m} ${evalLabels[m]}`}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-neutral-200 bg-neutral-50">
                      <td className="py-2 px-2 text-xs font-bold text-neutral-600">미디어</td>
                      <td colSpan={2} className="py-1 px-1">
                        <input
                          value={mediaTime}
                          onChange={e => setMediaTime(e.target.value)}
                          placeholder="미디어 사용 시간 및 내용"
                          className="w-full px-2 py-1 text-xs bg-transparent outline-none
                                     border-b border-transparent focus:border-primary-300 transition"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 우측: AI 대화창 */}
            <div className="bg-white rounded-2xl shadow-card border border-neutral-100 lg:w-1/2 flex flex-col overflow-hidden">
              {/* 대화창 헤더 */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-100 bg-gradient-to-r from-primary-50 to-violet-50">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-sm flex-shrink-0">
                  🤖
                </div>
                <div>
                  <div className="font-black text-primary-800 text-sm">AI 자기경영 코치</div>
                  <div className="text-xs text-neutral-400">할 일을 말하면 매트릭스에 자동 배치해 드려요</div>
                </div>
                <button
                  onClick={analyzeAndPlaceTasks}
                  className="ml-auto px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary-500 to-violet-600
                             text-white text-xs font-bold shadow-sm hover:from-primary-600 hover:to-violet-700 transition whitespace-nowrap"
                >
                  🎯 AI 배치
                </button>
              </div>

              {/* 메시지 목록 */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[400px]">
                {aiMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'ai' && (
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-xs mr-2 flex-shrink-0 mt-0.5">🤖</div>
                    )}
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed
                      ${msg.role === 'user'
                        ? 'bg-primary-500 text-white rounded-br-md'
                        : 'bg-neutral-100 text-neutral-800 rounded-bl-md'}`}
                    >
                      <p>{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-primary-200 text-right' : 'text-neutral-400'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
                {aiTyping && (
                  <div className="flex justify-start">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white text-xs mr-2 flex-shrink-0 mt-0.5">🤖</div>
                    <div className="bg-neutral-100 rounded-2xl rounded-bl-md px-4 py-2.5 flex items-center gap-1">
                      {[0,1,2].map(i => (
                        <div key={i} className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* 입력창 */}
              <div className="px-4 pb-4 pt-2 border-t border-neutral-100">
                <div className="flex gap-2">
                  <input
                    value={aiInput}
                    onChange={e => setAiInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendAiMessage()}
                    placeholder="오늘 할 일이나 고민을 입력하세요..."
                    className="flex-1 px-3 py-2.5 rounded-xl border-2 border-neutral-200
                               focus:border-primary-400 outline-none text-xs transition bg-neutral-50 focus:bg-white"
                  />
                  <button
                    onClick={sendAiMessage}
                    disabled={!aiInput.trim() || aiTyping}
                    className="px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600
                               text-white text-sm font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    전송
                  </button>
                </div>
                <p className="text-[10px] text-neutral-400 mt-1.5 text-center">
                  "AI 배치" 버튼으로 대화 내용을 아이젠하워 매트릭스에 자동 배치
                </p>
              </div>
            </div>
          </div>

          {/* ── 아이젠하워 매트릭스 ── */}
          <div className="bg-white rounded-2xl shadow-card border border-neutral-100 p-6">
            <h2 className="text-lg font-black text-primary-800 mb-1 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-accent-100 flex items-center justify-center text-sm">📊</span>
              아이젠하워 매트릭스
            </h2>
            <p className="text-xs text-neutral-400 mb-4">드래그앤드롭으로 할 일을 이동하거나, AI 대화 후 "AI 배치" 버튼을 활용하세요</p>

            {/* 입력 폼 */}
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-5 mb-5 border border-primary-100">
              <p className="text-sm font-bold text-primary-700 mb-3">새 할 일 직접 추가</p>
              <div className="grid md:grid-cols-2 gap-3 mb-3">
                <input
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTask('do')}
                  placeholder="할 일을 입력하세요"
                  className="px-4 py-3 rounded-xl border-2 border-primary-200 bg-white
                             focus:border-primary-500 outline-none text-sm transition"
                />
                <select
                  value={inputArea}
                  onChange={e => setInputArea(e.target.value as GrowthArea | '')}
                  className="px-4 py-3 rounded-xl border-2 border-primary-200 bg-white
                             focus:border-primary-500 outline-none text-sm transition"
                >
                  <option value="">성장 영역 선택</option>
                  {GROWTH_AREAS.map(a => (
                    <option key={a.key} value={a.key}>{a.icon} {a.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <input type="date" value={inputDate} onChange={e => setInputDate(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border-2 border-primary-200 bg-white
                             focus:border-primary-500 outline-none text-sm transition" />
                <input value={inputPerson} onChange={e => setInputPerson(e.target.value)}
                  placeholder="담당자 (선택)"
                  className="px-4 py-2.5 rounded-xl border-2 border-primary-200 bg-white
                             focus:border-primary-500 outline-none text-sm transition" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {QUADS.map(q => (
                  <button
                    key={q.key}
                    onClick={() => addTask(q.key)}
                    className={`py-2.5 rounded-xl text-white text-xs font-bold shadow-sm
                                hover:opacity-90 transition ${q.header}`}
                  >{q.icon} {q.label}에 추가</button>
                ))}
              </div>
            </div>

            {/* 4사분면 그리드 (드래그앤드롭) */}
            <div className="grid grid-cols-2 gap-4">
              {QUADS.map(q => {
                const qTasks = tasks.filter(t => t.quad === q.key)
                return (
                  <div
                    key={q.key}
                    className={`rounded-2xl border-2 ${q.border} ${q.bg} overflow-hidden transition-all
                      ${draggingId !== null ? 'ring-2 ring-offset-1 ring-primary-300 cursor-copy' : ''}`}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(q.key)}
                  >
                    <div className={`${q.header} px-4 py-2.5 flex items-center justify-between`}>
                      <span className="text-white font-black text-sm">{q.icon} {q.label}</span>
                      <span className="text-white/80 text-xs">{q.sub}</span>
                    </div>
                    <div className="p-3 space-y-2 min-h-[120px]">
                      {qTasks.length === 0 && (
                        <p className="text-xs text-neutral-400 text-center pt-4">
                          {draggingId !== null ? '여기에 드롭하세요 📥' : '할 일을 추가해보세요'}
                        </p>
                      )}
                      {qTasks.map(t => {
                        const area = GROWTH_AREAS.find(a => a.key === t.area)
                        return (
                          <div
                            key={t.id}
                            draggable
                            onDragStart={() => handleDragStart(t.id)}
                            onDragEnd={() => setDraggingId(null)}
                            className={`flex items-center gap-2 bg-white/80 rounded-xl px-3 py-2
                                       border border-white/50 shadow-sm group cursor-grab active:cursor-grabbing
                                       transition-all ${draggingId === t.id ? 'opacity-40 scale-95' : 'hover:shadow-md'}`}
                          >
                            <button onClick={() => toggleTask(t.id)}
                              className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all
                                ${t.done ? q.dot + ' border-transparent' : 'border-neutral-300'}`}>
                              {t.done && <svg viewBox="0 0 12 12" fill="white"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" fill="none"/></svg>}
                            </button>
                            <span className={`flex-1 text-xs font-medium truncate
                              ${t.done ? 'line-through text-neutral-400' : 'text-neutral-700'}`}>
                              {t.text}
                            </span>
                            {area && <span className="text-xs">{area.icon}</span>}
                            <span className="text-[10px] text-neutral-300 opacity-0 group-hover:opacity-100">⠿</span>
                            <button onClick={() => removeTask(t.id)}
                              className="opacity-0 group-hover:opacity-100 text-neutral-400
                                         hover:text-red-400 transition text-xs">✕</button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 성장영역별 요약 */}
            <div className="mt-5 pt-5 border-t border-neutral-100">
              <p className="text-xs font-bold text-neutral-500 mb-3">바로세움 6대 성장영역 진행 현황</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {areaCounts.map(a => (
                  <div key={a.key} className={`${a.bg} rounded-xl p-2.5 text-center`}>
                    <div className="text-lg mb-1">{a.icon}</div>
                    <div className={`text-xs font-bold ${a.text} mb-1`}>{a.label}</div>
                    <div className="text-xs text-neutral-500">{a.done}/{a.total}</div>
                    <div className="mt-1 h-1 bg-neutral-200 rounded-full overflow-hidden">
                      <div className={`h-full ${a.bar} rounded-full transition-all`}
                        style={{ width: a.total ? `${(a.done / a.total) * 100}%` : '0%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── 하루 성찰 4문항 ── */}
          <div className="bg-white rounded-2xl shadow-card border border-neutral-100 p-6">
            <h2 className="text-lg font-black text-primary-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-sm">🌙</span>
              하루 성찰
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { key: 'good',      icon: '✅', label: '오늘 내가 잘 한 것은 무엇인가요?',        color: 'border-emerald-200 focus:border-emerald-400' },
                { key: 'regret',    icon: '💭', label: '오늘 나 스스로 아쉬운 점은 무엇인가요?',  color: 'border-blue-200 focus:border-blue-400' },
                { key: 'tomorrow',  icon: '🚀', label: '내일 더 잘 해보고 싶은 것은 무엇인가요?', color: 'border-violet-200 focus:border-violet-400' },
                { key: 'gratitude', icon: '🙏', label: '오늘 감사할 일은 무엇인가요?',            color: 'border-amber-200 focus:border-amber-400' },
              ].map(item => (
                <div key={item.key}>
                  <label className="text-xs font-bold text-neutral-600 mb-1.5 block">
                    {item.icon} {item.label}
                  </label>
                  <textarea
                    value={reflection[item.key as keyof typeof reflection]}
                    onChange={e => setReflection(prev => ({ ...prev, [item.key]: e.target.value }))}
                    rows={3}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${item.color} bg-neutral-50
                               focus:bg-white outline-none text-sm resize-none transition`}
                  />
                </div>
              ))}
            </div>
          </div>
        </>)}

        {/* ================================================================
            탭2: 주간 점검
        ================================================================ */}
        {mainTab === 'weekly' && (<>
          <div className="bg-white rounded-2xl shadow-card border border-neutral-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black text-primary-800 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center text-sm">📊</span>
                1주일 약속 점검
              </h2>
              <input type="date" value={weeklyDate} onChange={e => setWeeklyDate(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-neutral-200 text-sm outline-none
                           focus:border-primary-400 transition" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="bg-primary-50 rounded-xl">
                    <th className="py-3 px-4 text-left text-xs font-bold text-primary-700 w-24 rounded-l-xl">영역</th>
                    <th className="py-3 px-4 text-left text-xs font-bold text-primary-700">목 표</th>
                    <th className="py-3 px-4 text-left text-xs font-bold text-primary-700">실 천</th>
                    <th className="py-3 px-4 text-left text-xs font-bold text-primary-700">체 크</th>
                    <th className="py-3 px-4 text-left text-xs font-bold text-primary-700 rounded-r-xl">개 선</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {weeklyRows.map((row, idx) => (
                    <tr key={row.label} className="hover:bg-neutral-50 transition">
                      <td className="py-4 px-4 font-bold text-neutral-700 text-sm">{row.label}</td>
                      {(['goal','practice','check','improve'] as (keyof WeeklyRow)[]).map(field => (
                        <td key={field} className="py-2 px-3">
                          <textarea
                            value={row[field]}
                            onChange={e => updateWeekly(idx, field, e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs
                                       focus:border-primary-400 outline-none resize-none bg-neutral-50
                                       focus:bg-white transition min-w-[100px]"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 일일 점검 */}
          <div className="bg-white rounded-2xl shadow-card border border-neutral-100 p-6">
            <h2 className="text-lg font-black text-primary-800 mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-sm">📝</span>
              일일 점검 — 오늘은 무엇을 공부해 볼까요?
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {[
                { key: 'subject',         label: '교과 학습' },
                { key: 'extracurricular', label: '학업외 활동' },
                { key: 'etc',             label: '기타' },
              ].map(item => (
                <div key={item.key}>
                  <label className="text-xs font-bold text-neutral-600 mb-1.5 block">{item.label}</label>
                  <textarea
                    value={dailyCheck[item.key as keyof DailyCheck]}
                    onChange={e => setDailyCheck(prev => ({ ...prev, [item.key]: e.target.value }))}
                    rows={5}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-neutral-200
                               focus:border-emerald-400 outline-none text-sm resize-none
                               bg-neutral-50 focus:bg-white transition"
                  />
                </div>
              ))}
            </div>
            <h3 className="text-sm font-bold text-neutral-700 mb-3">
              ✨ 오늘 발견한 나의 좋은점은 무엇인가요?
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { key: 'goodRelation', label: '친구관계' },
                { key: 'goodStudy',    label: '학습' },
                { key: 'goodEtc',      label: '기타' },
              ].map(item => (
                <div key={item.key}>
                  <label className="text-xs font-bold text-neutral-500 mb-1.5 block">{item.label}</label>
                  <textarea
                    value={dailyCheck[item.key as keyof DailyCheck]}
                    onChange={e => setDailyCheck(prev => ({ ...prev, [item.key]: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-xl border-2 border-neutral-200
                               focus:border-amber-400 outline-none text-sm resize-none
                               bg-neutral-50 focus:bg-white transition"
                  />
                </div>
              ))}
            </div>
          </div>
        </>)}

        {/* ================================================================
            탭3: 성찰노트
        ================================================================ */}
        {mainTab === 'reflection' && (<>
          <div className="bg-white rounded-2xl shadow-card border border-neutral-100 p-6">
            <h2 className="text-lg font-black text-primary-800 mb-5 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-sm">📔</span>
              자아성찰노트
            </h2>

            {/* 작성 폼 */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-5 mb-6 border border-indigo-100">
              <p className="text-sm font-bold text-indigo-700 mb-4">
                {editingNote !== null ? '✏️ 성찰노트 수정' : '+ 새 성찰노트 작성'}
              </p>
              <div className="grid md:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs font-bold text-neutral-500 mb-1 block">제 목</label>
                  <input
                    value={noteForm.title}
                    onChange={e => setNoteForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="성찰 제목"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-indigo-200 bg-white
                               focus:border-indigo-500 outline-none text-sm transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-500 mb-1 block">중심어</label>
                  <input
                    value={noteForm.keyword}
                    onChange={e => setNoteForm(prev => ({ ...prev, keyword: e.target.value }))}
                    placeholder="핵심 키워드"
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-indigo-200 bg-white
                               focus:border-indigo-500 outline-none text-sm transition"
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="text-xs font-bold text-neutral-500 mb-1 block">내 용</label>
                <textarea
                  value={noteForm.content}
                  onChange={e => setNoteForm(prev => ({ ...prev, content: e.target.value }))}
                  rows={5}
                  placeholder="오늘 배우고 느낀 점을 자유롭게 기록하세요"
                  className="w-full px-4 py-3 rounded-xl border-2 border-indigo-200 bg-white
                             focus:border-indigo-500 outline-none text-sm resize-none transition"
                />
              </div>
              <div className="mb-4">
                <label className="text-xs font-bold text-neutral-500 mb-1 block">5문장 요약</label>
                <textarea
                  value={noteForm.summary}
                  onChange={e => setNoteForm(prev => ({ ...prev, summary: e.target.value }))}
                  rows={3}
                  placeholder="핵심 내용을 5문장으로 요약해보세요"
                  className="w-full px-4 py-3 rounded-xl border-2 border-indigo-200 bg-white
                             focus:border-indigo-500 outline-none text-sm resize-none transition"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={saveNote}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700
                             text-white text-sm font-bold transition shadow-md"
                >저장</button>
                {editingNote !== null && (
                  <button
                    onClick={() => { setEditingNote(null); setNoteForm({ title: '', keyword: '', content: '', summary: '' }) }}
                    className="px-6 py-2.5 rounded-xl border-2 border-neutral-300
                               text-neutral-600 text-sm font-bold hover:bg-neutral-50 transition"
                  >취소</button>
                )}
              </div>
            </div>

            {/* 노트 목록 */}
            {noteList.length === 0 ? (
              <p className="text-center text-neutral-400 text-sm py-8">아직 작성된 성찰노트가 없습니다</p>
            ) : (
              <div className="space-y-3">
                {noteList.map((note, idx) => (
                  <div key={idx} className="bg-neutral-50 rounded-xl border border-neutral-200 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-bold text-neutral-800 text-sm">{note.title}</span>
                        {note.keyword && (
                          <span className="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-700
                                          text-xs rounded-full font-medium">#{note.keyword}</span>
                        )}
                      </div>
                      <button
                        onClick={() => { setNoteForm(note); setEditingNote(idx) }}
                        className="text-xs text-neutral-400 hover:text-indigo-600 transition"
                      >수정</button>
                    </div>
                    {note.content && <p className="text-xs text-neutral-600 mb-2 line-clamp-3">{note.content}</p>}
                    {note.summary && (
                      <p className="text-xs text-neutral-500 bg-white rounded-lg px-3 py-2 border border-neutral-100">
                        <span className="font-bold text-neutral-700">5문장 요약: </span>{note.summary}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>)}

        {/* ================================================================
            탭4: 비전과 꿈
        ================================================================ */}
        {mainTab === 'vision' && (<>
          <div className="bg-white rounded-2xl shadow-card border border-neutral-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-black text-primary-800 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center text-sm">🌟</span>
                진로 — 비전과 꿈
              </h2>
              <input type="date" value={visionDate} onChange={e => setVisionDate(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-neutral-200 text-sm outline-none
                           focus:border-primary-400 transition" />
            </div>
            <p className="text-xs text-neutral-400 mb-5 italic">
              "미래를 예측하는 가장 훌륭한 방법은 바로 직접 미래를 만드는 것이다." — 피터 드러커
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[620px]">
                <thead>
                  <tr className="bg-gradient-to-r from-amber-50 to-orange-50">
                    <th className="py-3 px-4 text-left text-xs font-bold text-amber-700 w-24 rounded-l-xl">영역</th>
                    <th className="py-3 px-4 text-center text-xs font-bold text-amber-700">한 달</th>
                    <th className="py-3 px-4 text-center text-xs font-bold text-amber-700">1 년</th>
                    <th className="py-3 px-4 text-center text-xs font-bold text-amber-700">5 년</th>
                    <th className="py-3 px-4 text-center text-xs font-bold text-amber-700 rounded-r-xl">10 년</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {visionRows.map((row, idx) => (
                    <tr key={row.label} className="hover:bg-neutral-50 transition">
                      <td className="py-4 px-4 font-bold text-neutral-700">{row.label}</td>
                      {(['month1','year1','year5','year10'] as (keyof VisionRow)[]).map(field => (
                        <td key={field} className="py-2 px-3">
                          <textarea
                            value={row[field]}
                            onChange={e => updateVision(idx, field, e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs
                                       focus:border-amber-400 outline-none resize-none bg-neutral-50
                                       focus:bg-white transition min-w-[100px]"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 바로세움 6대 영역 비전 */}
          <div className="bg-white rounded-2xl shadow-card border border-neutral-100 p-6">
            <h3 className="text-base font-black text-primary-800 mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary-100 flex items-center justify-center text-xs">🎯</span>
              바로세움 6대 성장영역별 목표
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {GROWTH_AREAS.map(area => {
                const areaTask = tasks.filter(t => t.area === area.key)
                return (
                  <div key={area.key} className={`${area.bg} rounded-xl p-4 border-2 border-white shadow-sm`}>
                    <div className={`flex items-center gap-2 mb-3 ${area.text} font-bold text-sm`}>
                      <span>{area.icon}</span>
                      <span>{area.label}</span>
                      <span className="text-xs opacity-70">— {area.desc}</span>
                    </div>
                    {areaTask.length === 0 ? (
                      <p className="text-xs text-neutral-400">등록된 할 일이 없습니다</p>
                    ) : (
                      <div className="space-y-1">
                        {areaTask.map(t => (
                          <div key={t.id} className="flex items-center gap-2 text-xs text-neutral-700">
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${area.bar}`}/>
                            <span className={t.done ? 'line-through text-neutral-400' : ''}>{t.text}</span>
                            {t.done && <span className="text-emerald-600 font-bold">✓</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </>)}

      </div>
    </main>
  )
}
