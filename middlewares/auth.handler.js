const boom = require('@hapi/boom')


const checkApiKey = (req, res, next) => {
    const apiKey = req.headers['api']

    if (apiKey === process.env.API_KEY) {
        next()
    }
    else {
        next(boom.unauthorized())
    }

}

const checkStudentRole = (req, res, next) => {
    const user = req.user
    if (user.role === "student") {
        next()
    }
    else {
        next(boom.unauthorized())
    }
}

const checkRoles = (...roles) => {


    return (req, res, next) => {
        const user = req.user
        if (roles.includes(user.role)) {
            next()
        }
        else {
            next(boom.unauthorized())
        }
    }
}

module.exports = { checkApiKey, checkStudentRole, checkRoles }