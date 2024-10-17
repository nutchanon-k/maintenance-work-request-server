const createError = require("../utils/create-error")
const jwt = require('jsonwebtoken')
const prisma = require('../models/prisma')


module.exports.authenticate = async (req, res, next) => {
    try{
        const authHeader = req.headers.authorization
        
        if(!authHeader){
            return createError(401, 'Unauthorized Header missing') 
        }

        const token = authHeader.split(' ')[1]

        if(!token){
            return createError(401, 'Unauthorized Token missing')
            
        }

        const verifyUser = jwt.verify(token, process.env.JWT_SECRET,(err, user) => {
            if(err){
                return createError(401, 'Unauthorized Token invalid')
            }
            return user
        })
        const user = await prisma.employee.findFirst({
            where: {
                id: verifyUser.id
            },

        })
        if(!user){
            return createError(401, 'Unauthorized User invalid')
        }

        req.user = user
        
        next()
    }catch(err){ 
        next(err)
    }
}