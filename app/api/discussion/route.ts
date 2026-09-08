import { NextRequest, NextResponse } from 'next/server'

// Phase 2: Claude API 실제 연동 예정
// 현재는 더미 응답 반환

export async function POST(req: NextRequest) {
  const { message, step } = await req.json()

  // TODO: Claude API 연동
  // const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  // const res = await anthropic.messages.create({
  //   model: 'claude-opus-4-5',
  //   max_tokens: 1024,
  //   messages: [{ role: 'user', content: message }],
  // })

  const replies: Record<number, string> = {
    0: `"${message}"는 매우 의미 있는 주제입니다. 핵심 질문을 3가지로 나눠볼까요?`,
    1: '논거가 탄탄합니다. 구체적인 사례를 하나 더 추가하면 설득력이 높아집니다.',
    2: '좋은 반론 분석이에요. 재반론 전략을 제안드릴게요: 공통점 인정 후 차이점 강조 전략이 효과적입니다.',
    3: '주장문 구조: [서론] 문제제기 → [본론] 근거 × 2 → [결론] 실천 제안으로 정리해볼까요?',
    4: '성찰 내용이 훌륭합니다. 메타인지를 높이기 위해 "다음에 다르게 할 점"도 기록해보세요.',
    5: 'SMART 목표 원칙을 적용해 첫 번째 실천을 구체화해보세요!',
  }

  const reply = replies[step] ?? '좋은 의견입니다! 계속 이야기해 주세요.'

  return NextResponse.json({ reply, step })
}
