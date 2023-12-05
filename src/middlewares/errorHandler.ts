import { ErrorRequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import HttpErrorException from '@/exceptions/contracts/HttpErrorException'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // error logger
  console.error(err)

  // http error handler
  if (err instanceof HttpErrorException) {
    return res.status(err.status).json({
      message: err.message,
    })
  }

  // global error handler
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message: 'Internal Server Error',
  })
}
