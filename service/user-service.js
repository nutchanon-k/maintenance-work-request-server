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
                    name: true,
                    departmentType : true
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
            level: true,
            isAvailable: true,
            location: {
                select: {
                    name: true
                }
            },
            department: {
                select: {
                    name: true,
                    departmentType : true
                }
            }
        }
    })
}
module.exports.createUserService = (data) => {
    return prisma.employee.create({data:data})
}
module.exports.updateUserService = (userId,cleanFieldsToUpdate) => {
    return prisma.employee.update({
        where: {
            id: Number(userId)
        },
        data: cleanFieldsToUpdate
    })
}
module.exports.deleteUserService = (userId) => {
    return prisma.employee.delete({
        where: {
            id: Number(userId)
        }
    })
}
