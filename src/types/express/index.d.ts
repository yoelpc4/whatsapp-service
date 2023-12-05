import { type Session } from '@/types'

declare global {
  namespace Express {
    export interface Request {
      session: Session
    }
  }
}
