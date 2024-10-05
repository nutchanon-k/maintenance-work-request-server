const prisma = require('../models/prisma')


module.exports.getRTask = (employeeId, machineId, departmentId, status, requestTime) => {
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
module.exports.createRTask = (employeeId, machineId, faultSymptoms, departmentId, image) => {
    return prisma.requestTask.create({
        data: {
            employeeId: Number(employeeId),
            machineId: Number(machineId),
            faultSymptoms,
            departmentId: Number(departmentId),
            image
        }
    })
}
module.exports.updateRTask = (requestId, employeeId, machineId, faultSymptoms, departmentId, image, status) => {
    return prisma.requestTask.update({
        where: {
            id: Number(requestId)
        },
        data: {
            employeeId: Number(employeeId),
            machineId: Number(machineId),
            faultSymptoms,
            departmentId: Number(departmentId),
            image,
            status
        }
    })
}
module.exports.deleteRTask = (requestId) => {
    return prisma.requestTask.delete({
        where: {
            id: Number(requestId)
        }
    })
}