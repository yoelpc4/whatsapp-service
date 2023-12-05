import { type makeInMemoryStore } from '@whiskeysockets/baileys'
import type makeWASocket from '@whiskeysockets/baileys'

export declare type Session = ReturnType<typeof makeWASocket> & {
  store: ReturnType<typeof makeInMemoryStore>
}
