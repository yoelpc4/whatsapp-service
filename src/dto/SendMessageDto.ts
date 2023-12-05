import { Expose } from 'class-transformer'

export default class SendMessageDto {
  @Expose()
  whatsappId!: string

  @Expose()
  text!: string
}
