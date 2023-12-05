import rateLimit from 'express-rate-limit'

export const throttle = rateLimit({
  windowMs: 60_000, // 1 minute
  limit: 60, // limit each IP to 60 requests per `window` (here, per minute)
  standardHeaders: true, // return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // disable the `X-RateLimit-*` headers
})
