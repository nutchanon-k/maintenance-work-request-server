const { getRTask, createRTask, updateRTask, deleteRTask, findMachine, getRTaskById } = require('../service/request-task-service')
const prisma = require('../models/prisma')
const path = require('path')
const fs = require('fs/promises')
const cloudinary = require('../config/cloudinary')
const getPublicId = require('../utils/getPublicId')



module.exports.getRequestTask = async (req, res, next) => {
    try {
        const { requestId, employeeId, machineId, departmentId, status, requestTime } = req.query
        const requestTasks = await getRTask(requestId, employeeId, machineId, departmentId, status, requestTime)
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
        const { employeeId, machineId, faultSymptoms, departmentId } = req.body
        const haveFile = !!req.file //ทำให้เป็น boolean

        let uploadResult = {}

        if (haveFile) {
            uploadResult = await cloudinary.uploader.upload(req.file.path, {
                overwrite: true,
                public_id: path.parse(req.file.path).name
                // public_id : req.file.filename
            })
            fs.unlink(req.file.path)
        }
        console.log(uploadResult)
        const data = {
            employeeId: Number(employeeId),
            machineId: Number(machineId),
            faultSymptoms: faultSymptoms,
            departmentId: Number(departmentId),
            image: uploadResult.secure_url || '',
        }

        const requestTask = await createRTask(data)
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
        const { employeeId, machineId, faultSymptoms, departmentId, status } = req.body
        const requestData = await getRTaskById(requestId)

        // check request task by ID
        if (!requestData) {
            return createError(404, 'Request task not found')
        }

        // check file
        const haveFile = !!req.file
        let uploadResult = {}
        if (haveFile) {
            uploadResult = await cloudinary.uploader.upload(req.file.path, {
                public_id: path.parse(req.file.path).name
            })
            fs.unlink(req.file.path)
            console.log(requestData)
            if (requestData.image) {
                cloudinary.uploader.destroy(getPublicId(requestData.image))
            }

        }

        let data = haveFile ?
            {
                employeeId: Number(employeeId),
                machineId: Number(machineId),
                faultSymptoms: faultSymptoms,
                departmentId: Number(departmentId),
                image: uploadResult.secure_url || '',
                status : status || ''
            }
            :
            {
                employeeId: Number(employeeId),
                machineId: Number(machineId),
                faultSymptoms: faultSymptoms,
                departmentId: Number(departmentId),
                status : status || ''
            }

        const requestTask = await updateRTask(requestId, data)
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
        const requestTask = await deleteRTask(requestId)
        res.status(200).json({
            message: 'Delete request task success',
            data: requestTask
        })
    } catch (err) {
        next(err)
    }
}



module.exports.getMachine = async (req, res, next) => {
    try {
        const { machineId } = req.params
        // console.log(machineId)

        const machines = await findMachine(machineId)
        console.log(machines)

        if (!machines) {
            return createError(404, 'Machine not found')
        }

        // console.log(machines)
        res.status(200).json({
            message: 'Get data machine success',
            data: machines
        })
    } catch (err) {
        next(err)
    }
}