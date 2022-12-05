const { Strategy } = require('passport-local')
const { findByEmail } = require('../../../components/user/store')
const boom = require('@hapi/boom')
const bcrypt = require('bcrypt')

const LocalStrategy = new Strategy({
    usernameField: 'email',
    passwordField: 'password'
},
    async (email, password, done) => {
        try {
            const user = await findByEmail(email)
            if (!user) {
                done(boom.unauthorized(), false)
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                done(boom.unauthorized(), false)
            }
            delete user.password
            done(null, user)

        } catch (error) {
            done(error, false)
        }

    })

module.exports = LocalStrategy