import { readdir, rm, stat } from 'fs/promises'
import { join } from 'path'
import { cwd } from 'process'
import { type Response } from 'express'
import makeWASocket, {
  Browsers,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  makeInMemoryStore,
  useMultiFileAuthState,
} from '@whiskeysockets/baileys'
import { type Boom } from '@hapi/boom'
import { toDataURL } from 'qrcode'
import NodeCache from 'node-cache'
import pino from 'pino'
import { plainToInstance } from 'class-transformer'
import { StatusCodes } from 'http-status-codes'
import NotFoundException from '@/exceptions/NotFoundException'
import InternalServerErrorException from '@/exceptions/InternalServerErrorException'
import CreateSessionDto from '@/dto/CreateSessionDto'
import { type Session } from '@/types'

const logger = pino({
  timestamp: () => `,"time":"${new Date().toJSON()}"`,
}).child({})

const msgRetryCounterCache = new NodeCache()

const sessions = new Map<string, Session>()

const retries = new Map<string, number>()

const getSessionDirPath = (id = '') => join(cwd(), 'storage', 'sessions', id)

const getStoreFilePath = (id = '') =>
  join(cwd(), 'storage', 'stores', id ? `${id}.json` : id)

const shouldReconnect = (id: string) => {
  let maxRetry = +(process.env.MAX_RETRY ?? 3)

  if (maxRetry < 1) {
    maxRetry = 1
  }

  let attempt = retries.get(id) ?? 0

  if (attempt < maxRetry) {
    ++attempt

    retries.set(id, attempt)

    console.log('Reconnecting...', {
      id,
      attempt,
    })

    return true
  }

  return false
}

const removeSession = async (id: string) => {
  try {
    const sessionDirPath = getSessionDirPath(id)

    const sessionDirStats = await stat(sessionDirPath)

    if (sessionDirStats.isDirectory()) {
      await rm(sessionDirPath, {
        recursive: true,
        force: true,
      })
    }

    const storeFilePath = getStoreFilePath(id)

    const storeFileStats = await stat(storeFilePath)

    if (storeFileStats.isFile()) {
      await rm(storeFilePath, {
        force: true,
      })
    }
  } catch {
    // no-op
  } finally {
    sessions.delete(id)

    retries.delete(id)
  }
}

export const createSession = async (dto: CreateSessionDto, res?: Response) => {
  const store = makeInMemoryStore({})

  store.readFromFile(getStoreFilePath(dto.id))

  const { state, saveCreds } = await useMultiFileAuthState(
    getSessionDirPath(dto.id)
  )

  const { version, isLatest } = await fetchLatestBaileysVersion()

  console.log(
    `using WA v${version.join('.')} (${isLatest ? 'Latest' : 'Oldest'})`
  )

  const socket = makeWASocket({
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    browser: Browsers.baileys('Desktop'),
    msgRetryCounterCache,
    printQRInTerminal: false,
    syncFullHistory: true,
    version,
  })

  store.bind(socket.ev)

  sessions.set(dto.id, {
    ...socket,
    store,
  })

  socket.ev.process(async (events) => {
    if (events['connection.update']) {
      const { connection, lastDisconnect, qr } = events['connection.update']

      if (connection === 'open') {
        await socket.sendPresenceUpdate('unavailable', dto.id)

        retries.delete(dto.id)
      } else if (connection === 'close') {
        const statusCode = (lastDisconnect?.error as Boom)?.output.statusCode

        if (
          statusCode === DisconnectReason.loggedOut ||
          !shouldReconnect(dto.id)
        ) {
          await removeSession(dto.id)

          return
        }

        const reconnectInterval =
          statusCode === DisconnectReason.restartRequired
            ? 0
            : +(process.env.RECONNECT_INTERVAL ?? 0)

        setTimeout(async () => {
          await createSession(dto, res)
        }, reconnectInterval)
      }

      if (!qr) {
        return
      }

      if (res && !res.headersSent) {
        try {
          res.status(StatusCodes.CREATED).json({
            data: {
              qrCodeDataUrl: await toDataURL(qr),
            },
            message: 'Please scan the given QR code to continue!',
          })
        } catch {
          throw new InternalServerErrorException(
            'Unable to convert QR code to data url'
          )
        }

        return
      }

      try {
        await socket.logout()
      } catch {
        // no-op
      } finally {
        await removeSession(dto.id)
      }
    } else if (events['creds.update']) {
      await saveCreds()
    }
  })
}

export const hasSession = (id: string) => sessions.has(id)

export const findSession = (id: string) => {
  const session = sessions.get(id)

  if (!session) {
    throw new NotFoundException(`Session ${id} not found`)
  }

  return session
}

export const deleteSession = async (id: string) => {
  const session = sessions.get(id)

  if (!session) {
    throw new NotFoundException(`Session ${id} not found`)
  }

  try {
    await session.logout()
  } catch {
    // no-op
  } finally {
    await removeSession(id)
  }
}

export const setUpSessions = async () => {
  const dirnames = await readdir(getSessionDirPath())

  for (const dirname of dirnames) {
    const stats = await stat(getSessionDirPath(dirname))

    if (!stats.isDirectory()) {
      continue
    }

    await createSession(
      plainToInstance(CreateSessionDto, {
        id: dirname,
      })
    )
  }
}

export const tearDownSessions = () => {
  sessions.forEach((session, sessionId) => {
    session.store.writeToFile(getStoreFilePath(sessionId))
  })
}
