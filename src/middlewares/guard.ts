import passport from 'passport'

export const guard = passport.authenticate('basic', { session: false })
