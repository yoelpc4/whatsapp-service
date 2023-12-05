import { Router } from 'express'
import {
  getPersons,
  sendMessage,
  sendMessages,
} from '@/controllers/personController'
import { validate } from '@/middlewares/validate'
import {
  sendPersonMessageValidations,
  sendPersonMessagesValidations,
} from '@/validations/personValidations'

const router = Router()

router.get('/', getPersons)

router.post(
  '/send-message',
  validate(sendPersonMessageValidations),
  sendMessage
)

router.post(
  '/send-messages',
  validate(sendPersonMessagesValidations),
  sendMessages
)

export default router
