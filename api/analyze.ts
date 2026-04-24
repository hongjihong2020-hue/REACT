import OpenAI from 'openai'

export const config = { runtime: 'edge' }

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { image, height, weight } = await req.json() as {
      image: string
      height: number
      weight: number
    }

    if (!image || !height || !weight) {
      return new Response(JSON.stringify({ error: '필수 정보가 누락되었습니다.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            '당신은 10년 경력의 전문 퍼스널 스타일리스트입니다. 사진과 신체 정보를 분석하여 친근하고 전문적인 스타일 컨설팅을 제공합니다. 반드시 JSON 형식으로만 응답하세요.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: { url: image },
            },
            {
              type: 'text',
              text: `키 ${height}cm, 몸무게 ${weight}kg인 사람의 스타일 컨설팅 보고서를 아래 JSON 형식으로 작성해주세요.

{
  "bodyType": {
    "type": "체형 타입명 (예: 역삼각형, 직사각형, 모래시계 등)",
    "description": "이 체형의 특징과 장점을 2~3문장으로 설명"
  },
  "recommendedStyles": [
    "구체적인 추천 스타일 1 (예: 와이드 숄더 재킷으로 상체 균형 강조)",
    "구체적인 추천 스타일 2",
    "구체적인 추천 스타일 3"
  ],
  "colorPalette": {
    "recommended": ["어울리는 색상 1", "어울리는 색상 2", "어울리는 색상 3"],
    "avoid": ["피할 색상 1", "피할 색상 2"]
  },
  "avoidStyles": [
    "피해야 할 스타일 1과 그 이유",
    "피해야 할 스타일 2와 그 이유"
  ],
  "stylingTips": [
    "장점을 살리는 구체적인 팁 1",
    "구체적인 팁 2",
    "구체적인 팁 3"
  ]
}`,
            },
          ],
        },
      ],
      max_tokens: 1500,
    })

    const raw = completion.choices[0].message.content ?? '{}'
    const report = JSON.parse(raw)

    return new Response(JSON.stringify(report), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({ error: '분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
