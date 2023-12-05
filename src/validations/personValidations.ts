import { body, ValidationChain } from 'express-validator'
import { formatWhatsappId } from '@/services/personService'
import { formatArrayPath } from '@/utils/validations'
import { type Session } from '@/types'

export const sendPersonMessageValidations: ValidationChain[] = [
  body('whatsappId')
    .notEmpty()
    .withMessage((value, { path }) => `${path} is required`)
    .bail()
    .isString()
    .withMessage((value, { path }) => `${path} must be a string`)
    .bail()
    .custom(async (value, { req, path }) => {
      const [metadata] = await (req.session as Session).onWhatsApp(
        formatWhatsappId(value)
      )

      if (!metadata || !metadata.exists) {
        throw new Error(`${path} is not on whatsapp`)
      }
    }),
  body('text')
    .notEmpty()
    .withMessage((value, { path }) => `${path} is required`)
    .bail()
    .isString()
    .withMessage((value, { path }) => `${path} must be a string`),
]

const minMessages = 2

const maxMessages = 100

export const sendPersonMessagesValidations: ValidationChain[] = [
  body('messages')
    .notEmpty()
    .withMessage((value, { path }) => `${path} is required`)
    .bail()
    .isArray({ min: minMessages, max: maxMessages })
    .withMessage(
      (value, { path }) =>
        `${path} must be an array with length between ${minMessages}-${maxMessages}`
    ),
  body('messages.*.whatsappId')
    .notEmpty()
    .withMessage((value, { path }) => `${formatArrayPath(path)} is required`)
    .bail()
    .isString()
    .withMessage(
      (value, { path }) => `${formatArrayPath(path)} must be a string`
    )
    .bail()
    .custom(async (value, { req, path }) => {
      const [metadata] = await (req.session as Session).onWhatsApp(
        formatWhatsappId(value)
      )

      if (!metadata || !metadata.exists) {
        throw new Error(`${formatArrayPath(path)} is not on whatsapp`)
      }
    }),
  body('messages.*.text')
    .notEmpty()
    .withMessage((value, { path }) => `${formatArrayPath(path)} is required`)
    .bail()
    .isString()
    .withMessage(
      (value, { path }) => `${formatArrayPath(path)} must be a string`
    ),
]
