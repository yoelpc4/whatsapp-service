import { type RequestHandler } from 'express'
import { plainToInstance } from 'class-transformer'
import { StatusCodes } from 'http-status-codes'
import * as sessionService from '@/services/sessionService'
import CreateSessionDto from '@/dto/CreateSessionDto'

export const createSession: RequestHandler = async (req, res, next) => {
  try {
    if (sessionService.hasSession(req.body.id)) {
      res.status(StatusCodes.CONFLICT).json({
        message: `Session ${req.body.id} already connected, please use another id to connect!`,
      })
    }

    await sessionService.createSession(
      plainToInstance(CreateSessionDto, req.body),
      res
    )
  } catch (err) {
    next(err)
  }
}

export const findSession: RequestHandler = (req, res, next) => {
  try {
    sessionService.findSession(req.params.id)

    res.status(StatusCodes.OK).json({
      message: `Session ${req.params.id} is found`,
    })
  } catch (err) {
    next(err)
  }
}

export const deleteSession: RequestHandler = async (req, res, next) => {
  try {
    await sessionService.deleteSession(req.params.id)

    res.status(StatusCodes.NO_CONTENT).send()
  } catch (err) {
    next(err)
  }
}
