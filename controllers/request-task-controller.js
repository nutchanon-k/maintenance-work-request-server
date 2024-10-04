const prisma = require('../models/prisma')
const { getRTask } = require('../service/request-task-service')
const createError = require('../utils/create-error')


module.exports.getRequestTask = async (req, res, next) => {
    try {
        const { employeeId, machineId, departmentId, status, requestTime } = req.query
        const requestTasks = await getRTask(employeeId, machineId, departmentId, status, requestTime)
        res.status(200).json({
            message: 'Get request task success',
            data: requestTasks
        })
    } catch (err) {
        next(err)
    }
}
module.exports.createRequestTask = async (req, res, next) => {
    try {
        const { employeeId, machineId, faultSymptoms, departmentId, image } = req.body

        const requestTask = await prisma.requestTask.create({
            data: {
                employeeId: Number(employeeId),
                machineId: Number(machineId),
                faultSymptoms,
                departmentId: Number(departmentId),
                image
            }
        })

        res.status(201).json({
            message: 'Create request task success',
            data: requestTask
        })


    } catch (err) {
        next(err)
    }
}
module.exports.updateRequestTask = async (req, res, next) => {
    try {
        const { requestId } = req.params
        const { employeeId, machineId, faultSymptoms, departmentId, image, status } = req.body
        const requestTask = await prisma.requestTask.update({
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
        res.status(200).json({
            message: 'Update request task success',
            data: requestTask
        })
    } catch (err) {
        next(err)
    }
}
module.exports.deleteRequestTask = async (req, res, next) => {
    try {
        const { requestId } = req.params
        const requestTask = await prisma.requestTask.delete({
            where: {
                id: Number(requestId)
            }
        })
        res.status(200).json({
            message: 'Delete request task success',
        })
    } catch (err) {
        next(err)
    }
}