const prisma = require('../models/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const createError = require('../utils/create-error')



module.exports.login = async(req, res, next) => {
    try{
        const { email, password } = req.body
        console.log(req.body)
        
        //check user by email
        const user = await prisma.employee.findUnique({
            where: {
                email: email
            },
       
        })
        if (!user) {
            return createError(400, 'email is not registered')
        }

        //compare password
        const passwordIsMatch = await bcrypt.compare(password, user.password)
        if (!passwordIsMatch) {
            return createError(400, 'email or password is incorrect')
        }

         //generate token
        const payload = {id: user.id}
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })


        //send token
        res.status(200).json({
            message: 'login success',
            token
        })
      
    }catch(err){
        next(err)
    }
}

exports.currentUser = async (req, res, next) => {
    try {
        const user = await prisma.employee.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                picture: true,
                locationId: true,
                departmentId: true,
                role: true,
                level: true
            }
        })
        res.json(user)
    } catch (err) {
        next(err)
    }
}