import { type RequestHandler } from 'express'
import {
  type FieldValidationError,
  ValidationChain,
  validationResult,
} from 'express-validator'
import { StatusCodes } from 'http-status-codes'
import { formatArrayPath } from '@/utils/validations'

export const validate =
  (validations: ValidationChain[]): RequestHandler =>
  async (req, res, next) => {
    await Promise.all(
      validations.map(async (validation) => await validation.run(req))
    )

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Please fix the following errors',
        errors: errors
          .formatWith((error) => ({
            path: formatArrayPath((error as FieldValidationError).path),
            value: (error as FieldValidationError).value,
            message: error.msg,
          }))
          .array(),
      })
    }

    next()
  }
