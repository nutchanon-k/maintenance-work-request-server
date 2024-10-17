const prisma = require('../models/prisma')

module.exports.getListMaintenanceTask = (requestId, id, employeeId, machineId, status) => {
    const query = {
        where: {},
        select: {
            id: true,
            requestId: true,
            requestTask: {
                select: {
                    employee: {
                        select: {
                            firstName: true,
                            lastName: true,
                            picture: true
                        }
                    },
                    machine: {
                        select: {
                            name: true,
                            location: {
                                select: {
                                    name: true
                                }
                            },
                            machineTypeId: true,
                            machineType: {
                                select: {
                                    details: true
                                }
                            }
                        }
                    },
                    faultSymptoms: true,
                    department: {
                        select: {
                            name: true
                        }
                    },
                    requestTime: true,
                    updatedTime : true,
                    status: true,
                    image: true,
                    isAssigned: true
                }
            },
            employeeId: true,
            employee: {
                select: {
                    firstName: true,
                    lastName: true,
                    picture: true,
                }
            },
            machineId: true,
            typeOfFailureId: true,
            typeOfFailure: {
                select: {
                    details: true
                }
            },
            typeOfRootCauseId: true,
            typeOfRootCause: {
                select: {
                    details: true
                }
            },
            rootCauseDetail: true,
            operationDetails: true,
            preventingRecurrence: true,
            equipmentUsed: true,
            additionalSuggestions: true,
            startTime: true,
            finishTime: true,
            acceptTime: true,
            status: true,
            image: true,
            note: true,
            isRejected : true,
            rejectReason : true
        }
    }
    if (requestId) {
        query.where.requestId = Number(requestId);
    }
    if (id) {
        query.where.id = Number(id);
    }
    if (employeeId) {
        query.where.employeeId = Number(employeeId);
    }
    if (machineId) {
        query.where.machineId = Number(machineId);
    }
    if (status) {
        query.where.status = status;
    }


    return prisma.maintenanceTask.findMany(query)
}
module.exports.createMTask = (
    requestId,
    employeeId,
    machineId,
    typeOfFailureId,
    note,
) => {
    return prisma.maintenanceTask.create({
        data: {
            requestId: Number(requestId),
            employeeId: Number(employeeId),
            machineId: Number(machineId),
            typeOfFailureId: Number(typeOfFailureId),
            note : note
        }
    })
}
module.exports.updateMTask = (maintenanceId,updateFields) => {
    return prisma.maintenanceTask.update({
        where: {
            id: Number(maintenanceId)
          },
          data: updateFields
    })
}
module.exports.deleteMTask = (maintenanceId) => {
    return prisma.maintenanceTask.delete({
        where: {
            id: Number(maintenanceId)
        }
    })
}

module.exports.getMaintenanceTaskById = (maintenanceId) => {
    return prisma.maintenanceTask.findUnique({
        where: {
            id: Number(maintenanceId)
        }
    })
}



module.exports.findTypeOfRootCause = (typeOfFailureId,machineTypeId) => {
    return prisma.typeOfRootCause.findMany({
        where: {
            typeOfFailureId: Number(typeOfFailureId),
            machineTypeId: Number(machineTypeId)
        },
        select: {
            id: true,
            details: true,
            typeOfFailure: {
                select: {
                    details: true
                }
            },
            machineType: {
                select: {
                    details: true
                }
            }
        }
    })
}


