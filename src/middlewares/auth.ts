import { type RequestHandler } from 'express'
import { findSession } from '@/services/sessionService'
import { StatusCodes } from 'http-status-codes'

export const auth: RequestHandler = (req, res, next) => {
  try {
    req.session = findSession(req.headers.session as string)

    next()
  } catch (err) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Unauthenticated',
    })
  }
}
