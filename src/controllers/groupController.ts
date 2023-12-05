import { type RequestHandler } from 'express'
import { plainToInstance } from 'class-transformer'
import { StatusCodes } from 'http-status-codes'
import * as groupService from '@/services/groupService'
import SendMessageDto from '@/dto/SendMessageDto'

export const getGroups: RequestHandler = async (req, res, next) => {
  try {
    const groups = await groupService.getGroups(req.session)

    res.status(StatusCodes.OK).json(groups.toJSON())
  } catch (err) {
    next(err)
  }
}

export const sendMessage: RequestHandler = async (req, res, next) => {
  try {
    await groupService.sendMessage(
      req.session,
      plainToInstance(SendMessageDto, req.body)
    )

    res.status(StatusCodes.CREATED).json({
      message: 'Successfully send message',
    })
  } catch (err) {
    next(err)
  }
}

export const sendMessages: RequestHandler = async (req, res, next) => {
  try {
    const errors = await groupService.sendMessages(
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
