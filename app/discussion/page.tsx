'use client'
import { useState, useRef, useEffect } from 'react'

/* =====================================================================
   어울림토론 마당 구조 (SO멘토링연구소 특허 양식 기반)
   토론주제 → 첫째(주장) → 둘째(질문과 답) → 숨고르기
           → 셋째(반론) → 넷째(질문과 답) → 숨고르기
           → 다섯째(마무리) → 뒤풀이(요약) → 소감
===================================================================== */
type MadangKey =
  | 'topic' | 'first' | 'second' | 'breath1'
  | 'third' | 'fourth' | 'breath2'
  | 'fifth' | 'epilogue' | 'feeling'

type Side = 'pro' | 'con' | null   // 찬성 / 반대 / 미선택

const MADANG: {
  key: MadangKey; label: string; sub: string; icon: string
  desc: string; tips: string[]
  placeholder: string; examples: string[]
  hasSides: boolean; isBreath: boolean; step6: string
}[] = [
  {
    key: 'topic', label: '주제 설정', sub: '', icon: '📌', step6: 'Raise',
    desc: '오늘 토론할 주제를 입력하세요. 찬성과 반대로 나뉠 수 있는 사회적 쟁점이 좋습니다.',
    tips: ['찬반이 명확히 나뉘는 주제', '나의 삶과 연결된 주제', '사회적으로 의미 있는 주제'],
    placeholder: '예: 인공지능이 교사를 대체할 수 있을까요?',
    examples: ['AI가 예술을 대체할 수 있는가?', '학교 스마트폰 사용을 허용해야 하는가?', '청소년 선거권을 낮춰야 하는가?', '동물 실험은 정당한가?'],
    hasSides: false, isBreath: false,
  },
  {
    key: 'first', label: '첫째 마당', sub: '주장', icon: '🗣️', step6: 'Build',
    desc: '찬성과 반대 양쪽 입장에서 핵심 주장을 펼칩니다. 먼저 자신의 입장을 선택하고, AI와 함께 논거를 강화하세요.',
    tips: ['핵심 주장을 1문장으로 요약', '3가지 이상 근거 준비', '사실·통계·사례로 뒷받침'],
    placeholder: '나의 주장과 핵심 근거를 입력하세요.',
    examples: ['주장: ~이다. 근거1: ... 근거2: ... 근거3: ...', 'OECD 자료에 따르면...', '실제 사례로 ○○국에서는...'],
    hasSides: true, isBreath: false,
  },
  {
    key: 'second', label: '둘째 마당', sub: '질문과 답', icon: '❓', step6: 'Dialogue',
    desc: '상대방의 주장에 궁금한 점을 질문하고 답합니다. 질문은 상대의 논리적 약점을 파고드는 것이 효과적입니다.',
    tips: ['"왜" "어떻게" 로 시작하는 질문', '상대의 근거 출처 확인', '가정의 허점 드러내기'],
    placeholder: '상대방에게 할 질문, 또는 받은 질문에 대한 답을 입력하세요.',
    examples: ['"그 통계의 출처는 어디인가요?"', '"○○의 경우에도 동일하게 적용되나요?"', '"예외적인 상황은 어떻게 처리하나요?"'],
    hasSides: false, isBreath: false,
  },
  {
    key: 'breath1', label: '숨고르기', sub: '잠깐 멈춤', icon: '🌿', step6: '·',
    desc: '지금까지의 논의를 잠깐 정리합니다. 상대방의 주장 중 인상 깊었던 점과 보완할 나의 논거를 메모하세요.',
    tips: ['상대 주장 중 설득력 있었던 점', '내 논거에서 보완할 점', '셋째 마당 반론 전략 구상'],
    placeholder: '지금까지의 토론을 정리해보세요. 어떤 부분이 인상 깊었나요?',
    examples: ['상대방 주장 중 ○○가 설득력 있었다', '내 근거 중 ○○를 보완해야겠다', '반론 전략: "공감 후 반전" 사용'],
    hasSides: false, isBreath: true,
  },
  {
    key: 'third', label: '셋째 마당', sub: '반론', icon: '⚔️', step6: 'Dialogue',
    desc: '상대방의 핵심 주장에 반론을 제기합니다. "공감 → 반전" 전략이 효과적입니다. 상대의 말을 인정하면서 핵심 차이를 부각하세요.',
    tips: ['"맞습니다, 그러나..." 전략', '근거의 신뢰성 문제 제기', '상위 가치(교육의 본질 등) 호소'],
    placeholder: '상대방 주장에 대한 반론을 입력하세요.',
    examples: ['"○○ 측의 우려는 타당합니다. 그러나 핵심은..."', '"그 통계는 ○○ 상황에만 해당됩니다."', '"더 중요한 가치는 바로..."'],
    hasSides: true, isBreath: false,
  },
  {
    key: 'fourth', label: '넷째 마당', sub: '질문과 답', icon: '💬', step6: 'Dialogue',
    desc: '반론에 대한 추가 질문과 답변을 나눕니다. 서로의 논리를 더욱 날카롭게 검증하는 단계입니다.',
    tips: ['반론의 근거를 더 구체화', '예외 상황으로 논리 검증', '상대의 재반론 예측'],
    placeholder: '추가 질문 또는 답변을 입력하세요.',
    examples: ['"반론의 근거로 제시한 ○○는 어디서 나온 것인가요?"', '"○○의 경우에도 반론이 성립하나요?"'],
    hasSides: false, isBreath: false,
  },
  {
    key: 'breath2', label: '숨고르기', sub: '잠깐 멈춤', icon: '🌿', step6: '·',
    desc: '다섯째 마당 최종 주장을 준비합니다. 전체 토론의 흐름을 정리하고, 가장 강력한 논거를 선별하세요.',
    tips: ['가장 강력한 논거 2가지 선별', '상대의 가장 강한 반론 예측', '결론 1문장 미리 작성'],
    placeholder: '다섯째 마당 준비: 최종 주장의 핵심을 정리해보세요.',
    examples: ['내 최강 논거: ①... ②...', '예상 반론: "○○" → 대응: "..."', '결론 1문장: "따라서 ○○이다"'],
    hasSides: false, isBreath: true,
  },
  {
    key: 'fifth', label: '다섯째 마당', sub: '주장 마무리', icon: '🎯', step6: 'Write',
    desc: '지금까지의 토론을 바탕으로 최종 주장을 마무리합니다. 핵심 논거를 재확인하고, 상대의 반론을 포용하면서 자신의 입장을 강화하세요.',
    tips: ['핵심 주장 재확인 + 강화', '상대 반론 일부 수용 후 극복', '실천 가능한 대안 제시'],
    placeholder: '최종 주장을 완성하세요. (찬성/반대 입장에서 마무리 발언)',
    examples: ['핵심 주장: "○○이다. 왜냐하면..." ', '상대 반론 수용: "○○ 우려는 타당하나, ..."', '대안 제시: "따라서 ○○을 제안합니다"'],
    hasSides: true, isBreath: false,
  },
  {
    key: 'epilogue', label: '뒤풀이 마당', sub: '주제 요약', icon: '📝', step6: 'Write',
    desc: '오늘 토론의 주제를 5문장 이내로 요약합니다. 찬성과 반대의 핵심 논거, 그리고 나의 최종 생각을 담으세요.',
    tips: ['5문장 이내로 압축', '찬반 핵심 논거 각 1문장', '나의 최종 입장 1문장'],
    placeholder: '5문장 이내로 오늘 토론의 주제를 요약해보세요.',
    examples: ['오늘 토론 주제는 "○○"였다.', '찬성 측은 ○○을 주장했다.', '반대 측은 ○○을 주장했다.', '핵심 쟁점은 ○○이었다.', '나는 ○○이 더 타당하다고 생각한다.'],
    hasSides: false, isBreath: false,
  },
  {
    key: 'feeling', label: '소감', sub: '', icon: '❤️', step6: 'Reflect',
    desc: '오늘 토론에 대한 솔직한 소감을 적습니다. 새롭게 알게 된 것, 달라진 생각, 다음에 개선할 점을 자유롭게 써보세요.',
    tips: ['처음 생각과 달라진 점', '가장 인상 깊었던 순간', '다음 토론에서 개선할 점'],
    placeholder: '오늘 토론 소감을 자유롭게 써주세요.',
    examples: ['처음엔 ○○라고 생각했지만 토론 후 ○○로 바뀌었다.', '상대 주장 중 ○○이 가장 설득력 있었다.', '다음엔 통계 자료를 더 준비하겠다.'],
    hasSides: false, isBreath: false,
  },
]

/* 마당 인덱스에서 숨고르기 구분 */
const BREATH_KEYS: MadangKey[] = ['breath1', 'breath2']

/* =====================================================================
   AI 데모 응답
===================================================================== */
const AI_REPLIES: Partial<Record<MadangKey, string[]>> = {
  topic: [
    '좋은 주제입니다! 이 주제로 토론하려면 먼저 ①핵심 쟁점은 무엇인가? ②어떤 집단에게 영향을 미치는가? ③찬성·반대의 핵심 논거는 무엇인가? 이 세 가지를 생각해보세요. 어떤 입장에서 시작하고 싶으신가요?',
    '훌륭한 주제 선정이에요! 이 주제는 찬성 측에서는 ○○을, 반대 측에서는 ○○을 핵심 논거로 내세울 수 있습니다. 어느 입장에서 논리를 펼쳐보고 싶으신가요?',
  ],
  first: [
    '탄탄한 주장이에요! 더 강하게 만들기 위해: ① 구체적인 통계나 연구 결과를 추가하면 설득력이 높아집니다. ② PEEL 구조(주장→근거→사례→연결)로 정리해보세요. 어떤 자료를 더 찾아보고 싶으신가요?',
    '논거가 잘 구성되었습니다. 여기에 반대 입장에서 제기할 수 있는 약점을 미리 보완하면 더 강한 논거가 됩니다. 상대방이 어떤 반론을 제기할 것 같으신가요?',
  ],
  second: [
    '좋은 질문입니다! 상대의 논리적 허점을 파고드는 전략: ① 근거의 출처와 신뢰성을 물어보기 ② 예외 상황을 제시하여 일반화 오류 지적 ③ "왜?" "어떻게?"로 추가 설명 요구. 어떤 방식으로 질문할까요?',
    '질문이 예리합니다. 상대방이 답변하기 어려운 후속 질문을 준비해두세요. 상대가 "○○"라고 답한다면, 어떻게 재질문하시겠어요?',
  ],
  breath1: [
    '잠깐 멈추고 정리해봅시다. 지금까지 토론에서 ①상대 주장 중 설득력 있었던 부분과 ②내 논거에서 보완할 부분을 체크하세요. 셋째 마당 반론을 어떻게 준비하실 건가요?',
    '숨고르기 시간입니다. 셋째 마당에서 효과적인 반론을 위해 "공감 → 반전" 전략을 사용해보세요. "○○ 측의 우려는 타당합니다. 그러나 핵심은..."으로 시작하는 반론을 구상해보세요.',
  ],
  third: [
    '효과적인 반론 전략을 제안합니다: ① 공통점 인정 후 차이점 부각 → "맞습니다, 하지만..." ② 근거의 신뢰성 문제 제기 ③ 상위 가치(본질) 호소. 어떤 전략이 이 주제에 더 적합할 것 같으신가요?',
    '반론이 날카롭습니다! "공감 → 반전" 구조가 효과적입니다. 상대의 논리를 일부 수용하되, 핵심 차이점을 강조해서 자신의 입장을 더욱 강화하세요.',
  ],
  fourth: [
    '추가 질문으로 상대의 논거를 더 검증해보세요. 이 단계에서 핵심은 상대의 재반론을 예측하고 미리 대비하는 것입니다. 다음 예상 반론에는 어떻게 대응하시겠어요?',
    '좋은 질문이에요. 이제 상대방이 어떻게 답할지 예측해보세요. 그 답변에 대한 재반론도 준비하면 다섯째 마당 마무리가 훨씬 강해집니다.',
  ],
  breath2: [
    '마지막 준비입니다! 다섯째 마당을 위해 ①가장 강력한 논거 2가지 ②상대 반론에 대한 최종 대응 ③결론 1문장을 미리 정리해두세요. 어떤 논거가 가장 설득력 있었나요?',
    '이제 마무리를 준비합시다. 전체 토론의 흐름을 돌아보면서 내 입장의 핵심을 1문장으로 압축해보세요. 그 문장을 다섯째 마당 시작과 끝에 사용하면 강력한 마무리가 됩니다.',
  ],
  fifth: [
    '최종 주장 구조를 제안합니다:\n① 핵심 주장 재확인 (1문장)\n② 가장 강력한 근거 2가지\n③ 상대 반론 일부 수용 후 극복\n④ 실천 가능한 대안 제시\n⑤ 마무리 선언\n\n이 구조로 작성해볼까요?',
    '훌륭한 마무리입니다! 상대 주장을 일부 수용하면서 자신의 입장을 강화하는 "포용적 결론"이 가장 설득력 있습니다. 청중이 고개를 끄덕일 마무리 문장을 만들어보세요.',
  ],
  epilogue: [
    '5문장 요약 구조: ①주제 소개 ②찬성 핵심 논거 ③반대 핵심 논거 ④핵심 쟁점 ⑤나의 최종 입장. 이 구조로 정리해보세요!',
    '훌륭한 요약입니다! 5문장 안에 오늘 토론의 핵심이 잘 담겼어요. 이 요약을 바탕으로 소감을 써보시면 더욱 깊은 성찰이 될 것입니다.',
  ],
  feeling: [
    '깊은 성찰이 느껴집니다! 메타인지를 더 키우려면: ① 처음 생각과 달라진 점 ② 가장 어려웠던 순간 ③ 다음 토론에서 개선할 점 3가지를 기록해두세요. 이 경험이 다음 토론을 더 강하게 만들 것입니다!',
    '훌륭한 소감입니다. 토론 후 이렇게 성찰하는 과정이 진짜 성장입니다. 다음 어울림토론에서는 오늘 배운 점을 적용해보세요!',
  ],
}

/* =====================================================================
   타입
===================================================================== */
type Msg = { role: 'user' | 'ai'; text: string; madang: MadangKey }

/* =====================================================================
   메인 컴포넌트
===================================================================== */
export default function DiscussionPage() {
  const [activeIdx,  setActiveIdx]  = useState(0)
  const [side,       setSide]       = useState<Side>(null)
  const [topic,      setTopic]      = useState('')      // 설정된 토론 주제
  const [sessionNum, setSessionNum] = useState('')      // 차 토론
  const [userName,   setUserName]   = useState('')      // 이름
  const [messages,   setMessages]   = useState<Msg[]>([
    { role: 'ai', text: '어울림토론 AI에 오신 것을 환영합니다! 🎉\nSO멘토링연구소의 어울림토론 양식을 기반으로 AI가 함께 토론을 코칭해드립니다.\n\n먼저 오늘 토론할 주제를 입력해주세요!', madang: 'topic' },
  ])
  const [input,      setInput]      = useState('')
  const [loading,    setLoading]    = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const m = MADANG[activeIdx]

  /* 메시지 전송 */
  const send = async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || loading) return
    if (m.key === 'topic' && !topic) setTopic(msg)
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: msg, madang: m.key }])
    setLoading(true)
    await new Promise(r => setTimeout(r, 900 + Math.random() * 400))
    const replies = AI_REPLIES[m.key] ?? ['좋은 의견입니다! 계속 이야기해 주세요.']
    const reply = replies[Math.floor(Math.random() * replies.length)]
    setMessages(prev => [...prev, { role: 'ai', text: reply, madang: m.key }])
    setLoading(false)
  }

  /* 다음 마당으로 */
  const goNext = () => {
    if (activeIdx >= MADANG.length - 1) return
    const next = activeIdx + 1
    setActiveIdx(next)
    setSide(null)
    const nextM = MADANG[next]
    const breathMsg = BREATH_KEYS.includes(nextM.key)
      ? `🌿 **숨고르기** — ${nextM.desc}`
      : `✅ ${m.label} 완료!\n\n**${nextM.label}${nextM.sub ? ` — ${nextM.sub}` : ''}** 단계입니다.\n\n${nextM.desc}`
    setMessages(prev => [...prev, { role: 'ai', text: breathMsg, madang: nextM.key }])
  }

  /* 완료 후 리셋 */
  const reset = () => {
    setActiveIdx(0); setSide(null); setTopic(''); setSessionNum(''); setUserName('')
    setMessages([{ role: 'ai', text: '새로운 어울림토론을 시작합니다! 오늘의 토론 주제를 입력해주세요. 🎯', madang: 'topic' }])
  }

  const isDone = activeIdx === MADANG.length - 1

  /* ================================================================
     렌더
  ================================================================ */
  return (
    <div className="min-h-screen bg-neutral-50 pb-16">

      {/* ── 헤더 ── */}
      <div className="bg-gradient-to-br from-primary-700 to-primary-500 text-white px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 text-xs font-semibold mb-2">
                <span>🏛️</span><span>SO멘토링연구소 · 어울림토론</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black">어울림토론 AI</h1>
              <p className="text-white/70 text-sm mt-0.5">마당 구조 기반 토론 코칭 · 2021년~ 부천 어울림토론 운영</p>
            </div>
            {/* 토론 정보 입력 */}
            <div className="flex gap-2 flex-wrap">
              <input value={sessionNum} onChange={e => setSessionNum(e.target.value)}
                placeholder="___차 토론"
                className="bg-white/20 text-white placeholder-white/50 border border-white/30 rounded-lg px-3 py-1.5 text-sm w-24 focus:outline-none focus:border-white" />
              <input value={userName} onChange={e => setUserName(e.target.value)}
                placeholder="이름"
                className="bg-white/20 text-white placeholder-white/50 border border-white/30 rounded-lg px-3 py-1.5 text-sm w-28 focus:outline-none focus:border-white" />
            </div>
          </div>

          {/* 토론 주제 배너 */}
          {topic && (
            <div className="mt-3 bg-white/15 border border-white/25 rounded-xl px-4 py-2.5 text-sm">
              <span className="text-white/60 text-xs font-bold mr-2">📌 토론 주제</span>
              <span className="font-semibold">{topic}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-5 space-y-4">

        {/* ── 마당 네비게이션 ── */}
        <div className="card p-3 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {MADANG.map((mg, i) => {
              const isBreath = BREATH_KEYS.includes(mg.key)
              const isActive = activeIdx === i
              const isDoneStep = i < activeIdx
              return (
                <button
                  key={mg.key}
                  onClick={() => { setActiveIdx(i); setSide(null) }}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all flex-shrink-0
                    ${isBreath
                      ? `${isActive ? 'bg-emerald-500 text-white shadow-md' : isDoneStep ? 'bg-emerald-50 text-emerald-600' : 'text-emerald-400 hover:bg-emerald-50'}`
                      : isActive
                        ? 'bg-hero-gradient text-white shadow-card'
                        : isDoneStep
                          ? 'bg-primary-50 text-primary-600 border border-primary-200'
                          : 'text-neutral-400 hover:bg-neutral-50'
                    }`}
                >
                  <span className="text-base leading-none">{mg.icon}</span>
                  <span className="font-black text-[10px] whitespace-nowrap">{mg.label}</span>
                  {mg.sub && <span className="text-[9px] opacity-70 whitespace-nowrap">{mg.sub}</span>}
                  {isDoneStep && !isActive && <span className="text-[9px] text-primary-500 font-black">✓</span>}
                </button>
              )
            })}
          </div>
          {/* 진행 바 */}
          <div className="mt-2 h-1 bg-neutral-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full transition-all duration-500"
              style={{ width: `${(activeIdx / (MADANG.length - 1)) * 100}%` }} />
          </div>
          {/* 바로세움 6단계 연결 표시 */}
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-neutral-400">
            <span className="font-bold">바로세움</span>
            {['Raise','Build','Dialogue','Write','Reflect','Act'].map(s => (
              <span key={s}
                className={`px-1.5 py-0.5 rounded font-semibold transition-all
                  ${m.step6 === s ? 'bg-primary-100 text-primary-600' : 'text-neutral-300'}`}>
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* ── 메인 영역 ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* 왼쪽 패널 — 마당 안내 */}
          <div className="space-y-3 lg:col-span-1">

            {/* 현재 마당 설명 */}
            <div className={`card p-5 space-y-3 ${BREATH_KEYS.includes(m.key) ? 'border-2 border-emerald-200 bg-emerald-50' : ''}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0
                  ${BREATH_KEYS.includes(m.key) ? 'bg-emerald-100' : 'bg-hero-gradient'}`}>
                  {m.icon}
                </div>
                <div>
                  <div className="font-black text-neutral-800 text-base">{m.label}</div>
                  {m.sub && <div className="text-xs text-neutral-500">{m.sub}</div>}
                </div>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed">{m.desc}</p>

              {/* 핵심 포인트 */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-neutral-400 uppercase tracking-wide">핵심 포인트</div>
                {m.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-neutral-600">
                    <span className="w-4 h-4 rounded-full bg-primary-100 text-primary-600 font-bold flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">{i+1}</span>
                    {tip}
                  </div>
                ))}
              </div>

              {/* 찬성/반대 선택 (hasSides=true인 마당) */}
              {m.hasSides && (
                <div>
                  <div className="text-xs font-bold text-neutral-400 mb-2">나의 입장 선택</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSide('pro')}
                      className={`py-2.5 rounded-xl text-sm font-black border-2 transition-all
                        ${side === 'pro'
                          ? 'bg-primary-500 text-white border-primary-500 shadow-md'
                          : 'bg-white text-primary-600 border-primary-200 hover:border-primary-400'}`}
                    >
                      👍 찬성
                    </button>
                    <button
                      onClick={() => setSide('con')}
                      className={`py-2.5 rounded-xl text-sm font-black border-2 transition-all
                        ${side === 'con'
                          ? 'bg-accent-500 text-white border-accent-500 shadow-md'
                          : 'bg-white text-accent-600 border-accent-200 hover:border-accent-400'}`}
                    >
                      👎 반대
                    </button>
                  </div>
                  {side && (
                    <div className={`mt-2 text-center text-xs font-bold px-3 py-1.5 rounded-lg
                      ${side === 'pro' ? 'bg-primary-50 text-primary-600' : 'bg-accent-50 text-accent-600'}`}>
                      {side === 'pro' ? '👍 찬성 입장으로 토론합니다' : '👎 반대 입장으로 토론합니다'}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 예시 입력 카드 */}
            <div className="card p-4 space-y-2">
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wide">예시 입력</div>
              {m.examples.map((ex, i) => (
                <button key={i} onClick={() => send(ex)}
                  className="w-full text-left text-xs text-neutral-600 bg-neutral-50 hover:bg-primary-50 hover:text-primary-700 px-3 py-2 rounded-lg transition border border-neutral-100 hover:border-primary-200">
                  "{ex}"
                </button>
              ))}
            </div>

            {/* 다음 마당 / 완료 버튼 */}
            {!isDone ? (
              <button onClick={goNext} className="btn-primary w-full py-3 text-sm font-bold">
                {MADANG[activeIdx + 1].icon} {MADANG[activeIdx + 1].label}으로 →
              </button>
            ) : (
              <div className="card p-5 text-center space-y-3">
                <div className="text-3xl">🎉</div>
                <div className="font-black text-primary-600">어울림토론 완료!</div>
                <p className="text-xs text-neutral-500">
                  {sessionNum && `제${sessionNum}차 토론 `}
                  {userName && `${userName}님, `}
                  오늘도 훌륭한 토론이었습니다.
                </p>
                <button onClick={reset} className="btn-outline text-xs py-2 w-full">
                  새 주제로 다시 시작
                </button>
              </div>
            )}
          </div>

          {/* 오른쪽 — 채팅 */}
          <div className="card flex flex-col lg:col-span-2" style={{ height: '580px' }}>

            {/* 채팅 헤더 */}
            <div className="px-4 py-3 border-b border-neutral-100 flex items-center gap-2 flex-wrap">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0
                ${BREATH_KEYS.includes(m.key) ? 'bg-emerald-100' : 'bg-hero-gradient text-white'}`}>
                {m.icon}
              </div>
              <span className="text-sm font-black text-neutral-700">
                {m.label}{m.sub ? ` — ${m.sub}` : ''}
              </span>
              {side && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ml-1
                  ${side === 'pro' ? 'bg-primary-100 text-primary-600' : 'bg-accent-100 text-accent-600'}`}>
                  {side === 'pro' ? '👍 찬성' : '👎 반대'}
                </span>
              )}
              <span className="ml-auto text-xs text-neutral-400">{activeIdx + 1} / {MADANG.length}</span>
            </div>

            {/* 메시지 목록 */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-2.5`}>
                  {msg.role === 'ai' && (
                    <div className="w-8 h-8 rounded-xl bg-hero-gradient flex items-center justify-center text-white text-[10px] font-black flex-shrink-0 mt-0.5">AI</div>
                  )}
                  <div className={msg.role === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user'}>
                    <p className="leading-relaxed whitespace-pre-line text-sm">{msg.text}</p>
                    {/* 마당 뱃지 */}
                    {msg.role === 'user' && (
                      <div className="mt-1.5 flex items-center gap-1">
                        <span className="text-[10px] opacity-60">
                          {MADANG.find(mg => mg.key === msg.madang)?.icon} {MADANG.find(mg => mg.key === msg.madang)?.label}
                        </span>
                        {side && msg.madang === m.key && (
                          <span className={`text-[10px] font-bold opacity-70 ml-1
                            ${side === 'pro' ? 'text-primary-300' : 'text-accent-300'}`}>
                            {side === 'pro' ? '찬성' : '반대'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-hero-gradient flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">AI</div>
                  <div className="chat-bubble-ai flex items-center gap-1 py-3">
                    <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-neutral-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* 입력 영역 */}
            <div className="border-t border-neutral-100 p-4 space-y-2">
              {/* 찬성/반대 선택 안내 (hasSides이고 미선택) */}
              {m.hasSides && !side && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-700 font-semibold">
                  <span>⚠️</span> 왼쪽 패널에서 찬성/반대 입장을 먼저 선택해주세요
                </div>
              )}
              <div className="flex gap-2">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                  placeholder={m.placeholder}
                  rows={2}
                  className="input-base resize-none text-sm flex-1"
                />
                <button
                  onClick={() => send()}
                  disabled={!input.trim() || loading}
                  className="btn-primary px-4 py-2 flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed text-sm self-stretch"
                >
                  전송
                </button>
              </div>
              <p className="text-xs text-neutral-400">
                Enter 전송 · Shift+Enter 줄바꿈 · 왼쪽 예시 클릭으로 빠른 입력
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
