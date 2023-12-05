import HttpErrorException from '@/exceptions/contracts/HttpErrorException'

export default class NotFoundException extends HttpErrorException {
  status = 404
  message = 'Not Found'
}
