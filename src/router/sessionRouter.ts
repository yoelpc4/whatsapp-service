import { Router } from 'express'
import {
  createSession,
  deleteSession,
  findSession,
} from '@/controllers/sessionController'
import { validate } from '@/middlewares/validate'
import { createSessionValidations } from '@/validations/sessionValidations'

const router = Router()

router.post('/', validate(createSessionValidations), createSession)

router.get('/:id', findSession)

router.delete('/:id', deleteSession)

export default router
