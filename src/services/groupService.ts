import { delay } from '@whiskeysockets/baileys'
import type SendMessageDto from '@/dto/SendMessageDto'
import { type Session } from '@/types'

const suffix = '@g.us'

export const formatWhatsappId = (value: string) =>
  value.toString().endsWith(suffix) ? value : `${value}${suffix}`

export const getGroups = (session: Session) =>
  session.store.chats.filter((chat) => chat.id.endsWith(suffix))

export const sendMessage = async (session: Session, dto: SendMessageDto) =>
  await session.sendMessage(formatWhatsappId(dto.whatsappId), {
    text: dto.text,
  })

export const sendMessages = async (
  session: Session,
  dtos: SendMessageDto[]
) => {
  const errors: SendMessageDto[] = []

  for (const dto of dtos) {
    try {
      await delay(100)

      await session.sendMessage(formatWhatsappId(dto.whatsappId), {
        text: dto.text,
      })
    } catch (err) {
      console.error(err)

      errors.push(dto)
    }
  }

  return errors
}
