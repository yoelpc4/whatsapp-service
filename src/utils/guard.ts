import passport from 'passport'
import { BasicStrategy } from 'passport-http'

export const init = () => {
  passport.use(
    new BasicStrategy((username, password, done) =>
      done(
        null,
        username === process.env.GUARD_USERNAME &&
          password === process.env.GUARD_PASSWORD
      )
    )
  )
}
