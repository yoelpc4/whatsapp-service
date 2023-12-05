import { body, ValidationChain } from 'express-validator'

export const createSessionValidations: ValidationChain[] = [
  body('id')
    .notEmpty()
    .withMessage((value, { path }) => `${path} is required`)
    .bail()
    .isString()
    .withMessage((value, { path }) => `${path} must be a string`),
]
