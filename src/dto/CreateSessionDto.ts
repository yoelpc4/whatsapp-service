import { Expose } from 'class-transformer'

export default class CreateSessionDto {
  @Expose()
  id!: string
}
