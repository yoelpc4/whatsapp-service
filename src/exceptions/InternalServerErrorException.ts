import HttpErrorException from '@/exceptions/contracts/HttpErrorException'

export default class InternalServerErrorException extends HttpErrorException {
  status = 500
  message = 'Internal Server Error'
}
