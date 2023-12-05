import { Router } from 'express'
import sessionRouter from '@/router/sessionRouter'
import personRouter from '@/router/personRouter'
import groupRouter from '@/router/groupRouter'
import { auth } from '@/middlewares/auth'
import { guard } from '@/middlewares/guard'
import { throttle } from '@/middlewares/throttle'

const router = Router()

router.use(throttle)

router.use(guard)

router.use('/sessions', sessionRouter)

router.use('/persons', auth, personRouter)

router.use('/groups', auth, groupRouter)

export default router
