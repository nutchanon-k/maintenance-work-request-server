//check role Admin

const prisma = require('../models/prisma')
const createError = require('../utils/create-error')

module.exports.checkRoleAdmin = async (req, res, next) => {
    try {
        const checkAdmin = await prisma.employee.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                role: true
            }
        })
        if (checkAdmin.role !== 'admin') {
            return createError(403, 'Only admin')
        }
        next()
    } catch (err) {
        next(err)
    }
}

