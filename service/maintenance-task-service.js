const e = require('express');
const prisma = require('../models/prisma')

module.exports.getListMaintenanceTask = (requestId, id, machineId, status, searchText, requesterUserId,maintenanceUserId ) => {
    const query = {
        where: {
        },
        orderBy: {
            id: 'desc'
        },
        select: {
            id: true,
            requestId: true,
            requestTask: {
                select: {
                    employeeId: true,
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
                            locationId: true,
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
    console.log("maintenance id in service",id)
    if (id) {
        query.where.id = Number(id);
    }

    console.log("maintenance staff id in service",maintenanceUserId)
    if (maintenanceUserId) {
        query.where.employeeId = Number(maintenanceUserId);
    }
    if (machineId) {
        query.where.machineId = Number(machineId);
    }
    if (status) {
        query.where.status = status;
    }
    console.log("ID requester from service",requesterUserId)
    if (requesterUserId) {
        console.log(requesterUserId)
        query.where.requestTask = {
            employeeId: Number(requesterUserId)
        }
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
        },
        select: {
            id: true,
            requestId: true,
            requestTask: {
                select: {
                    employeeId: true,
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
module.exports.updateMTaskStatus = (maintenanceId,updateFields) => {
    return prisma.maintenanceTask.update({
        where: {
            id: Number(maintenanceId)
        },
        data: updateFields
    })
}


//for validate 
module.exports.findMachineById = (machineId) => {
    return prisma.machine.findUnique({
        where: {
            id: Number(machineId)
        },
    })
}

//for chart
module.exports.findTypeOfRootCauseForChart = async() => {
    const typeOfRootCause =  await prisma.typeOfRootCause.findMany({
        select: {
            id: true,
            details: true,
            typeOfFailureId: true,
            typeOfFailure: {
                select: {
                    details: true
                }
            },
            machineTypeId: true,
            machineType: {
                select: {
                    details: true
                }
            }
        }
    })
    const  machineType = await prisma.machineType.findMany({
        select: {
            id: true,
            details: true,     
        }
    })

    const  typeOfFailure = await prisma.typeOfFailure.findMany({
        select: {
            id: true,
            details: true,     
        }
    })

    return {typeOfRootCause,machineType, typeOfFailure}
}