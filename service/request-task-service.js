const { DepartmentType } = require('@prisma/client');
const prisma = require('../models/prisma');
const { request } = require('express');
createError = require('../utils/create-error')


module.exports.getRTask = (requestId, employeeId, machineId, departmentId, status, requestTime) => {
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
    if (requestId) {
        query.where.id = parseInt(requestId);
    }
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
module.exports.createRTask = ({ employeeId, machineId, faultSymptoms, departmentId, image }) => {
    return prisma.requestTask.create({
        data: {
            employeeId: Number(employeeId),
            machineId: Number(machineId),
            faultSymptoms,
            departmentId: Number(departmentId),
            image: image
        }
    })
}
module.exports.updateRTask = (requestId, {employeeId, machineId, faultSymptoms, departmentId, image, status}) => {
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
            status,
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

module.exports.getRTaskById = (requestId) => {
    return prisma.requestTask.findUnique({
        where: {
            id: Number(requestId)
        }
    })
}



module.exports.findMachine = (machineId) => {

    const query = {
        where: {
            id: Number(machineId)
        },
        select: {
            id: true,
            name: true,
            locationId: true,
            location: {
                select: {
                    name: true
                }
            },
            departmentId: true,
            department: {
                select: {
                    name: true,
                    departmentType: true
                }
            },
            machineTypeId: true,
            machineType: {
                select: {
                    details: true
                }
            }

        }
    };
    return prisma.machine.findFirst(query)

}

module.exports.updateRTaskIsAssigned = (requestId, isAssigned) => {
    return prisma.requestTask.update({
        where: {
            id: Number(requestId)
        },
        data: {
            isAssigned
        }
    })
}

module.exports.updateStatusService = (requestId, status) => {
    return prisma.requestTask.update({
        where: {
            id: Number(requestId)
        },
        data: {
            status
        }
    })
}