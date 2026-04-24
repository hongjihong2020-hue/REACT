import OpenAI from 'openai'
import { toFile } from 'openai/uploads'

export const config = { maxDuration: 60 }

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const { image } = (await req.json()) as { image: string }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const mimeMatch = image.match(/^data:([^;]+);base64,/)
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg'
    const ext = mimeType === 'image/png' ? 'png' : 'jpg'
    const base64Data = image.replace(/^data:[^;]+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')
    const file = await toFile(buffer, `photo.${ext}`, { type: mimeType })

    const result = await openai.images.edit({
      model: 'gpt-image-1',
      image: file,
      prompt:
        '너는 최고의 헤어스타일리스트야. 3x3 그리드로, 어떤 헤어스타일인지 설명과 함께 첨부한 사진속 사람이랑 최고로 잘 어울리는 헤어스타일 9개 생성해줘. 단, 첨부한 사람의 얼굴은 절대 바꾸지 말고 기존 얼굴 그대로 헤어스타일만 바꿔줘',
      n: 1,
      size: '1536x1024',
      quality: 'high',
    })

    const b64 = result.data[0].b64_json
    return new Response(
      JSON.stringify({ image: `data:image/png;base64,${b64}` }),
      { headers: { 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    console.error(err)
    return new Response(
      JSON.stringify({ error: '헤어스타일 생성 중 오류가 발생했습니다.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
