import dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
import hpp from 'hpp'
import nodeCleanup from 'node-cleanup'
import router from '@/router'
import { setUpSessions, tearDownSessions } from '@/services/sessionService'
import { errorHandler } from '@/middlewares/errorHandler'
import * as auth from '@/utils/guard'

dotenv.config()

const port = process.env.APP_PORT ?? 3000

const app = express()

app.use(helmet())

app.use(express.json())

app.use(
  express.urlencoded({
    extended: true,
  })
)

app.use(hpp())

auth.init()

app.use('/', router)

app.use(errorHandler)

app.listen(port, async () => {
  await setUpSessions()

  console.log(`Server is listening on port ${port}`)
})

nodeCleanup(tearDownSessions)
