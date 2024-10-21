const prisma = require('../models/prisma')
const bcrypt = require('bcryptjs')
const createError = require('../utils/create-error')
const { createUserService, getAllUsersService, getUserByEmail, updateUserService, deleteUserService, getUserById } = require('../service/user-service')
const path = require('path')
const fs = require('fs/promises')
const cloudinary = require('../config/cloudinary')
const getPublicId = require('../utils/getPublicId')


module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await getAllUsersService()
        res.status(200).json({ data: users })
    } catch (err) {
        next(err)
    }
}
module.exports.createUser = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            locationId,
            departmentId,
            role,
            level
        } = req.body
        console.log(req.body)
        // console.log(req.body)
        if (password !== confirmPassword) {
            return createError(400, 'password is not match')
        }

        //check user by email
        const user = await getUserByEmail(email)
        if (user) {
            return createError(400, 'email is already registered')
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        const haveFile = !!req.file
        let uploadResult = {}
        if (haveFile) {
            uploadResult = await cloudinary.uploader.upload(req.file.path, {
                overwrite: true,
                public_id: path.parse(req.file.path).name
                // public_id : req.file.filename
            })
            fs.unlink(req.file.path)
        }

        const data = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            picture: haveFile ? uploadResult.secure_url : '',
            locationId: Number(locationId),
            departmentId: Number(departmentId),
            role,
            level
        }


        //create user
        const newUser = await createUserService(data)

        res.status(201).json({
            message: 'Create user success',
            data: {
                id: newUser.id
            }
        })

    } catch (err) {
        next(err)
    }
}
module.exports.updateUser = async (req, res, next) => {
    try {
        const { userId } = req.params
        const userRole = req.user.role
        const id = req.user.id
        const userLevel = req.user.level


        //check user
        const checkUser = await getUserById(Number(userId))
        if (!checkUser) {
            return createError(404, 'User not found')
        }
        

        // Condition: Admin cannot update other Admins unless they are a manager
        // But can update their own profile
        if (userRole === 'admin' && userLevel !== 'manager' && checkUser.role === 'admin' && Number(userId) !== Number(id)) {
            return createError(403, 'Admin cannot update another Admin unless they are a manager');
        }

        const {
            firstName,
            lastName,
            email,
            password,
            locationId,
            departmentId,
            role,
            level,
            isAvailable
        } = req.body



        //hash password


        const fieldsToUpdate = {
            firstName,
            lastName,
            email,
            locationId: locationId ? Number(locationId) : undefined,
            departmentId: departmentId ? Number(departmentId) : undefined,
            role,
            level
        }

        const cleanFieldsToUpdate = Object.fromEntries(
            Object.entries(fieldsToUpdate).filter(([key, value]) => value !== undefined)
        );

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10)
            cleanFieldsToUpdate.password = hashedPassword
        }

        const haveFile = !!req.file
        let uploadResult = {}
        if (haveFile) {
            uploadResult = await cloudinary.uploader.upload(req.file.path, {
                public_id: path.parse(req.file.path).name
            })
            fs.unlink(req.file.path)
            console.log(checkUser)
            if (checkUser.image) {
                cloudinary.uploader.destroy(getPublicId(checkUser.image))
            }
            cleanFieldsToUpdate.picture = uploadResult.secure_url || ''
        }


        //update user
        const user = await updateUserService(Number(userId), cleanFieldsToUpdate)

        if (!user) {
            return createError(404, 'User not found')
        }
        res.status(200).json({
            message: 'Update user success',
            data: user
        })
    } catch (err) {
        next(err)
    }
}
module.exports.deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params
        const userRole = req.user.role
        const id = req.user.id
        const userLevel = req.user.level

        //check user
        const checkUser = await getUserById(Number(userId))
        if (!checkUser) {
            return createError(404, 'User not found')
        }

        // Condition: Admin cannot update other Admins unless they are a manager
        // But can update their own profile
        if (userRole === 'admin' && userLevel !== 'manager' && checkUser.role === 'admin' && Number(userId) !== Number(id)) {
            return createError(403, 'Admin cannot delete another Admin unless they are a manager');
        }

        const user = await deleteUserService(Number(userId))

        res.status(200).json({
            message: 'Delete user success',
        })
    } catch (err) {
        next(err)
    }
}


//for assign maintenance task
//maintenance can get all leader and staff
module.exports.getUsersForAssign = async (req, res, next) => {
    try {
        const { departmentId } = req.query
        const role = "maintenance"
        const levels = ["leader", "staff"]

        // console.log(levels)
        const users = await prisma.employee.findMany({
            where: {
                role: role,
                level: { in: levels },
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
                isAvailable: true,
                location: {
                    select: {
                        name: true
                    }
                },
                department: {
                    select: {
                        name: true
                    }
                },
                maintenanceTasks: {
                    where: {
                        status: {
                            in: ["backlog", "inProgress", "inReview"]
                        }
                    }
                }

            }
        })
        res.status(200).json({ data: users })
    } catch (err) {
        next(err)
    }
}
module.exports.getLocationDepartmentData = async (req, res, next) => {
    try {
        const locations = await prisma.location.findMany({
            select: {
                id: true,
                name: true
            }
        })
        const departments = await prisma.department.findMany({
            select: {
                id: true,
                name: true,
                departmentType: true,
                locationId: true,
                location: {
                    select: {
                        name: true
                    }
                }
            }
        })
        res.status(200).json({ locations, departments })
    } catch (err) {
        next(err)
    }

}
module.exports.getUserId = async (req, res, next) => {
    try {
        const { userId } = req.params
        const user = await getUserById(Number(userId))
        res.status(200).json({ data: user })
    } catch (err) {
        next(err)
    }
}



module.exports.changePassword = async (req, res, next) => {
    try {
        const { userId } = req.params
        const { oldPassword, newPassword, confirmNewPassword } = req.body
        const {id} = req.user


        //validate user
        if(Number(id) !== Number(userId)) {
            return createError(403, 'You are not authorized to change password')
        }

        //check old password
        const findPassword = await prisma.employee.findUnique({
            where: {
                id: Number(userId)
            },
            select: {
                password: true
            }
        })
        
        const passwordIsMatch = await bcrypt.compare(oldPassword, findPassword.password)
        
        if(!passwordIsMatch) {
            return createError(400, 'Old password is not correct')
        }

        //check new password
        if(newPassword !== confirmNewPassword) {
            return createError(400, 'New password is not match with confirm new password')
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        const user = await prisma.employee.update({
            where: {
                id: Number(userId)
            },
            data: {
                password: hashedPassword
            }
        })
    
        res.status(200).json({message: 'Change password success'})
    } catch (err) {
        next(err)
    }
}