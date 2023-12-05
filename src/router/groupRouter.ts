import { Router } from 'express'
import {
  getGroups,
  sendMessage,
  sendMessages,
} from '@/controllers/groupController'
import { validate } from '@/middlewares/validate'
import {
  sendGroupMessageValidations,
  sendGroupMessagesValidations,
} from '@/validations/groupValidations'

const router = Router()

router.get('/', getGroups)

router.post('/send-message', validate(sendGroupMessageValidations), sendMessage)

router.post(
  '/send-messages',
  validate(sendGroupMessagesValidations),
  sendMessages
)

export default router
