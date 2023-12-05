import { plainToInstance } from 'class-transformer'
import { type RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as personService from '@/services/personService'
import SendMessageDto from '@/dto/SendMessageDto'

export const getPersons: RequestHandler = async (req, res, next) => {
  try {
    const persons = await personService.getPersons(req.session)

    res.status(StatusCodes.OK).json(persons.toJSON())
  } catch (err) {
    next(err)
  }
}

export const sendMessage: RequestHandler = async (req, res, next) => {
  try {
    await personService.sendMessage(
      req.session,
      plainToInstance(SendMessageDto, req.body)
    )

    return res.status(StatusCodes.CREATED).json({
      message: 'Successfully send message',
    })
  } catch (err) {
    next(err)
  }
}

export const sendMessages: RequestHandler = async (req, res, next) => {
  try {
    const errors = await personService.sendMessages(
      req.session,
      req.body.messages.map((message: object) =>
        plainToInstance(SendMessageDto, message)
      )
    )

    if (errors.length > 0) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to send messages',
        errors,
      })
    }

    return res.status(StatusCodes.CREATED).json({
      message: 'Successfully send messages',
    })
  } catch (err) {
    next(err)
  }
}
