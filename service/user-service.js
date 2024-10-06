const prisma = require('../models/prisma')

module.exports.getAllUsersService = () => {
    return prisma.employee.findMany({
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
            }
        }
    })
}
module.exports.getUserByEmail = (email) => {
    return prisma.employee.findUnique({
        where: {
            email: email
        },

    })

}
module.exports.getUserById = (id) => {
    return prisma.employee.findFirst({
        where: {
            id: id
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
}
module.exports.createUserService = (
    firstName,
    lastName,
    email,
    hashedPassword,
    picture,
    locationId,
    departmentId,
    role,
    level
) => {
    return prisma.employee.create({
        data: {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            picture,
            locationId: Number(locationId),
            departmentId: Number(departmentId),
            role,
            level
        }
    })
}
module.exports.updateUserService = (
    firstName,
    lastName,
    email,
    hashedPassword,
    picture,
    locationId,
    departmentId,
    role,
    level,
    userId,
    isAvailable
) => {
    return prisma.employee.update({
        where: {
            id: Number(userId)
        },
        data: {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            picture,
            locationId: Number(locationId),
            departmentId: Number(departmentId),
            role,
            level,
            isAvailable
        }
    })
}
module.exports.deleteUserService = (userId) => {
    return prisma.employee.delete({
        where: {
            id: Number(userId)
        }
    })
}
