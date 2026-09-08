'use client'
import { useState } from 'react'

const PROGRAMS = [
  { key: 'diagnosis',    label: 'AI 성장 진단',         icon: '🎯' },
  { key: 'discussion',   label: '어울림토론 프로그램',    icon: '🗣️' },
  { key: 'self-mgmt',    label: '자기경영 코칭',         icon: '📋' },
  { key: 'bga',          label: 'BGA 뇌파검사',          icon: '🧠' },
  { key: 'parent',       label: '학부모 코칭',           icon: '👨‍👩‍👧' },
  { key: 'camp',         label: '체험학습·캠프',          icon: '✈️' },
]

const TIMES = ['오전 (10:00~12:00)', '오후 (14:00~17:00)', '저녁 (19:00~21:00)']

export default function ConsultationPage() {
  const [selected, setSelected] = useState<string[]>([])
  const [form, setForm] = useState({ name: '', phone: '', email: '', child: '', time: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const toggleProgram = (key: string) => {
    setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selected.length === 0) { alert('관심 프로그램을 1개 이상 선택해주세요.'); return }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="card p-10 max-w-md w-full text-center space-y-5">
          <div className="text-6xl">🎉</div>
          <h2 className="text-2xl font-black text-neutral-900">상담 신청 완료!</h2>
          <p className="text-neutral-500 leading-relaxed">
            <strong>{form.name}</strong>님의 상담 신청을 접수했습니다.<br />
            빠른 시일 내에 연락드리겠습니다.
          </p>
          <div className="bg-primary-50 rounded-2xl p-4 text-left space-y-2 text-sm">
            <div className="flex gap-2"><span className="text-neutral-400">성함</span><span className="font-semibold">{form.name}</span></div>
            <div className="flex gap-2"><span className="text-neutral-400">연락처</span><span className="font-semibold">{form.phone}</span></div>
            <div className="flex gap-2"><span className="text-neutral-400">선택 프로그램</span>
              <span className="font-semibold">{selected.map(k => PROGRAMS.find(p => p.key === k)?.label).join(', ')}</span>
            </div>
          </div>
          <button onClick={() => { setSubmitted(false); setForm({ name:'',phone:'',email:'',child:'',time:'',message:'' }); setSelected([]) }}
            className="btn-primary w-full py-3.5">
            새 상담 신청하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* 헤더 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-neutral-900">상담 문의</h1>
          <p className="text-neutral-500">SO멘토링연구소에 무료 상담을 신청하세요</p>
          <div className="flex items-center justify-center gap-4 text-sm text-neutral-400 pt-1">
            <span>📞 빠른 연락</span>
            <span>·</span>
            <span>🏫 부천 어울림토론 2021~</span>
            <span>·</span>
            <span>✈️ 국내외 캠프 70회+</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 관심 프로그램 */}
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-neutral-800">관심 프로그램 <span className="text-accent-500">*</span></h3>
            <p className="text-sm text-neutral-500">해당하는 항목을 모두 선택해주세요 (다중 선택 가능)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PROGRAMS.map(p => {
                const active = selected.includes(p.key)
                return (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => toggleProgram(p.key)}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 text-sm font-semibold
                      transition-all duration-150
                      ${active
                        ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-card'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-primary-300'
                      }`}
                  >
                    <span>{p.icon}</span>
                    <span className="text-left leading-snug">{p.label}</span>
                    {active && <span className="ml-auto text-primary-500 text-base">✓</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="card p-6 space-y-4">
            <h3 className="font-bold text-neutral-800">기본 정보</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">학부모 성함 <span className="text-accent-500">*</span></label>
                <input name="name" value={form.name} onChange={handleChange} required
                  placeholder="홍길동" className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">연락처 <span className="text-accent-500">*</span></label>
                <input name="phone" value={form.phone} onChange={handleChange} required
                  placeholder="010-0000-0000" className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">이메일</label>
                <input name="email" value={form.email} onChange={handleChange}
                  placeholder="example@email.com" type="email" className="input-base" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">자녀 학년</label>
                <input name="child" value={form.child} onChange={handleChange}
                  placeholder="예: 중학교 2학년" className="input-base" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">상담 희망 시간</label>
              <select name="time" value={form.time} onChange={handleChange} className="input-base">
                <option value="">선택해주세요</option>
                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1.5">문의 내용</label>
              <textarea name="message" value={form.message} onChange={handleChange}
                placeholder="자녀에 대해 궁금하신 점이나 원하시는 교육 방향을 자유롭게 작성해주세요."
                rows={4} className="input-base resize-none" />
            </div>
          </div>

          <button type="submit" className="btn-accent w-full py-4 text-base">
            📩 상담 신청하기
          </button>
          <p className="text-center text-xs text-neutral-400">
            * 개인정보는 상담 목적으로만 사용되며 제3자에게 제공되지 않습니다
          </p>
        </form>
      </div>
    </div>
  )
}
