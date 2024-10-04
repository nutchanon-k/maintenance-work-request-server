const prisma = require('../models/prisma')


module.exports.getRTask = (employeeId, machineId, departmentId, status, requestTime)=>{
    const query = {
        where: {},
        include: {
            employee: {
                select: {
                    firstName: true,
                    lastName: true,
                    picture: true,
                    role: true,
                    level: true
                }
            },
            machine: {
                include: {
                    machineType: true,
                    location: true
                },
            },
            department: true    
        }
    };

    if (employeeId) {
        query.where.employeeId = parseInt(employeeId);
    }
    if (machineId) {
        query.where.machineId = parseInt(machineId);
    }
    if (departmentId) {
        query.where.departmentId = parseInt(departmentId);
    }
    if (status) {
        query.where.status = status;
    }
    if (requestTime) {
        query.where.requestTime = {
            gte: new Date(requestTime)
        };
    }

    return prisma.requestTask.findMany(query)

}