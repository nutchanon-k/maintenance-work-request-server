const prisma = require('../models/prisma')

module.exports.getListMaintenanceTask = (requestId, employeeId, machineId) => {
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
        }
    }
    if (requestId) {
        query.where.requestId = Number(requestId);
    }
    if (employeeId) {
        query.where.employeeId = Number(employeeId);
    }
    if (machineId) {
        query.where.machineId = Number(machineId);
    }


    return prisma.maintenanceTask.findMany(query)
}
module.exports.createMTask = (
    requestId,
    employeeId,
    machineId,
    typeOfFailureId,
    typeOfRootCauseId,
    rootCauseDetail,
    operationDetails,
    preventingRecurrence,
    equipmentUsed,
    additionalSuggestions,
    image
) => {
    return prisma.maintenanceTask.create({
        data: {
            requestId: Number(requestId),
            employeeId: Number(employeeId),
            machineId: Number(machineId),
            typeOfFailureId: Number(typeOfFailureId),
            typeOfRootCauseId: Number(typeOfRootCauseId),
            rootCauseDetail,
            operationDetails,
            preventingRecurrence,
            equipmentUsed,
            additionalSuggestions,
            image
        }
    })
}
module.exports.updateMTask = (
    maintenanceId,
    requestId,
    employeeId,
    machineId,
    typeOfFailureId,
    typeOfRootCauseId,
    rootCauseDetail,
    operationDetails,
    preventingRecurrence,
    equipmentUsed,
    additionalSuggestions,
    finishTime,
    acceptTime,
    isRejected,
    rejectReason,
    status,
    image
) => {
    return prisma.maintenanceTask.update({
        where: {
            id: Number(maintenanceId)
          },
          data: {
            requestId: Number(requestId),
            employeeId: Number(employeeId),
            machineId: Number(machineId),
            typeOfFailureId: Number(typeOfFailureId),
            typeOfRootCauseId: Number(typeOfRootCauseId),
            rootCauseDetail,
            operationDetails,
            preventingRecurrence,
            equipmentUsed,
            additionalSuggestions,
            finishTime,
            acceptTime,
            isRejected,
            rejectReason,
            status,
            image
          }
    })
}
module.exports.deleteMTask = (maintenanceId) => {
    return prisma.maintenanceTask.delete({
        where: {
            id: Number(maintenanceId)
        }
    })
}