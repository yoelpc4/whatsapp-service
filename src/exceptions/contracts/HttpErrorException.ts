export default abstract class HttpErrorException extends Error {
  status: number
  message: string
}
