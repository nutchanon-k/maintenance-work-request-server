const prisma = require('../models/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const createError = require('../utils/create-error')

module.exports.getAllUsers = async (req, res, next) => {
    try{
        const users = await prisma.employee.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                picture: true,
                locationId: true,
                departmentId: true,
                role: true,
                level: true,
                isAvailable: true
            }
        })
        const locations = await prisma.location.findMany({})
        const departments = await prisma.department.findMany({})

        res.status(200).json({users,locations,departments})
    }catch(err){
        next(err)
    }
}
module.exports.createUser = async (req, res, next) => {
    try{
        const { 
            firstName, 
            lastName, 
            email, 
            password,  
            picture, 
            locationId, 
            departmentId, 
            role, 
            level 
        } = req.body
        // console.log(req.body)
        
        //check user by email
        const user = await prisma.employee.findUnique({
            where: {
                email: email
            },
       
        })
        if (user) {
            return createError(400, 'email is already registered')
        }
        
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        //create user
        const newUser = await prisma.employee.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                picture,
                locationId : Number(locationId),
                departmentId: Number(departmentId),
                role,
                level
            }
        })

        res.status(201).json({
            message: 'Create user success',
            data : {
                id: newUser.id
            }
        })

    }catch(err){
        next(err)
    }
}
module.exports.updateUser = async (req, res, next) => {
    try{
        const { 
            firstName, 
            lastName, 
            email, 
            password,  
            picture, 
            locationId, 
            departmentId, 
            role, 
            level 
        } = req.body
        const { userId } = req.params

        const hashedPassword = await bcrypt.hash(password, 10)
      
        //update user
        const user = await prisma.employee.update({
            where: {
                id: Number(userId)
            },
            data: {
                firstName,
                lastName,
                email,
                password : hashedPassword,
                picture,
                locationId : Number(locationId),
                departmentId: Number(departmentId),
                role,
                level
            }
        })
        if (!user) {
            return createError(404, 'User not found')
        }
        res.status(200).json({
            message: 'Update user success',
        })
    }catch(err){
        next(err)
    }
}

module.exports.deleteUser = async (req, res, next) => {
    try{
        const { userId } = req.params
        const user = await prisma.employee.delete({
            where: {
                id: Number(userId)
            }
        })
        if (!user) {
            return createError(404, 'User not found')
        }
        res.status(200).json({
            message: 'Delete user success',
        })
    }catch(err){
        next(err)
    }
}


//for assign maintenance task
module.exports.getUsers = async (req, res, next) => {
    try{
        const {role,level,departmentId} = req.query
        // console.log(role,level,departmentId)
        const levels = level ? level.split(',') : []
        // console.log(levels)
        const users = await prisma.employee.findMany({
            where: {
                role: role,
                ...(levels.length > 0 ? { level: { in: levels } } : {}),
                departmentId: Number(departmentId) || undefined  
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
                level: true,
                isAvailable: true
            }
        })
        const locations = await prisma.location.findMany({})
        const departments = await prisma.department.findMany({})
 
        res.status(200).json({users,locations,departments})
    }catch(err){
        next(err)
    }   
}
