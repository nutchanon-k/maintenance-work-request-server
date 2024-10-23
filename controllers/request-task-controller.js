const { getRTask, createRTask, updateRTask, deleteRTask, findMachine, getRTaskById, updateRTaskIsAssigned, updateStatusService } = require('../service/request-task-service')
// const prisma = require('../models/prisma')
const path = require('path')
const fs = require('fs/promises')
const cloudinary = require('../config/cloudinary')
const getPublicId = require('../utils/getPublicId')
const { findMachineById } = require('../service/maintenance-task-service')
const { getUserById } = require('../service/user-service')


//main function CRUD
module.exports.getRequestTask = async (req, res, next) => {
    try {
        const { requestId, employeeId, machineId, departmentId, status, requestTime } = req.query
        const role = req.user.role
        const level = req.user.level
        const userId = req.user.id
        // console.log("role and level", role, level, userId)
        const requestTasks = await getRTask(role, level, userId, requestId, employeeId, machineId, departmentId, status, requestTime)
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
        const role = req.user.role
        
        if(role === 'maintenance') {
            return createError(403, 'Only requester and admin can create request task')
        }

        const checkMachine = await findMachineById(Number(machineId))
        //check machine is exist
        if(!checkMachine) {
            return createError(404, 'Machine not found')
        }
        

        //check relation between department and machine
        if(Number(checkMachine.departmentId) !== Number(departmentId)) {
            return createError(403, 'departmentId not match with machine departmentId')
        }

        const checkEmployee = await getUserById(Number(employeeId))
        if(!checkEmployee) {
            return createError(404, 'employeeId not found')
        }


        let uploadResult = {}

        if (haveFile) {
            uploadResult = await cloudinary.uploader.upload(req.file.path, {
                overwrite: true,
                public_id: path.parse(req.file.path).name
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
        const requestData = await getRTaskById(Number(requestId))
        const role = req.user.role
        const level = req.user.level
        const userId = req.user.id

        if(role === 'maintenance') {
            return createError(403, 'Only requester and admin can edit request task')
        }

        if (role !== 'admin' && Number(requestData.employeeId) !== Number(userId) && !(role === 'requester' && (level === 'manager' || level === 'leader'))) {
            return createError(403, 'You are not authorized to edit this request task');
        }

        // check request task by ID
        if (!requestData) {
            return createError(404, 'Request task not found')
        }

        const checkMachine = await findMachineById(Number(machineId))
        //check machine is exist
        if(!checkMachine) {
            return createError(404, 'Machine not found')
        }
        
        
        //check relation between department and machine
        if(Number(checkMachine.departmentId) !== Number(departmentId)) {
            return createError(403, 'departmentId not match with machine departmentId')
        }

        // check employee
        const checkEmployee = await getUserById(Number(employeeId))
        if(!checkEmployee) {
            return createError(404, 'employeeId not found')
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
                status : status || '',
                
            }
            :
            {
                employeeId: Number(employeeId),
                machineId: Number(machineId),
                faultSymptoms: faultSymptoms,
                departmentId: Number(departmentId),
                status : status || '',
               
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
        const role = req.user.role
        const level = req.user.level
        const userId = req.user.id


        const requestData = await getRTaskById(requestId)

        //role & level validate
        if (!requestData) {
            return createError(404, 'Request task not found')
        }
        if (requestData.status === 'success') {
            return createError(400, 'Request task already success')
        }
        if(role === 'maintenance') {
            return createError(403, 'Only requester and admin can delete request task')
        }
        if (role !== 'admin' && requestData.employeeId !== userId && !(role === 'requester' && (level === 'manager' || level === 'leader'))) {
            return createError(403, 'You are not authorized to delete this request task');
        }

        const requestTask = await deleteRTask(requestId)
        res.status(200).json({
            message: 'Delete request task success',
            data: requestTask
        })
    } catch (err) {
        next(err)
    }
}




//สำหรับกรอกตอนสร้าง req task 
module.exports.getMachine = async (req, res, next) => {
    try {
        const { machineId } = req.params
        
        if (isNaN(Number(machineId))) {
            return createError(400, 'Machine id must be a number')
        }
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

//สำหรับ update status request task เฉพาะ assign ใช้ได้เฉพาะ admin หรือ maintenance leader ขึ้นไป
module.exports.updateRequestTaskIsAssign = async (req, res, next) => {
    try {
        const { requestId } = req.params
        const { isAssigned } = req.body

        const role = req.user.role
        const level = req.user.level
        

        if(role === "requester" || (role === "maintenance" && level === "staff")) {
            return createError(403, 'Only maintenance leader and admin can assign request task')
        }

        // validate value
        if(isNaN(Number(requestId))) {
            return createError(400, 'Request id must be a number')
        }

        if(![false, true].includes(isAssigned)) {
            return createError(400, 'isAssigned must be a boolean')
        }
      
        // check request task is exist
        const checkRequestTask = await getRTaskById(requestId)
        if (!checkRequestTask) {
            return createError(404, 'Request task not found')
        }
        
        
        const requestTask = await updateRTaskIsAssigned(requestId,isAssigned)
        res.status(200).json({
            message: 'Assigned request task success',
            data: requestTask
        })
    } catch (err) {
        next(err)
    }
}

//สำหรับ update status request task เฉพาะ admin หรือ requester ในหน้า in review 
module.exports.updateRequestStatus = async (req, res, next) => {
    try {
        const { requestId } = req.params
        const { status } = req.body
        const role = req.user.role

        // role validate
        if(role === "maintenance") {
            return createError(403, 'Only requester and admin can change request task status')
        }

        
        // validate value
        if(isNaN(Number(requestId))) {
            return createError(400, 'Request id must be a number')
        }

        console.log(status)

        if (!['success','inProgress'].includes(status)) {
            return createError(400, 'Status must be success')
        }


        const checkRequestTask = await getRTaskById(requestId)
        if(!checkRequestTask){
            return createError(404, 'Request task not found')
        }

        const requestTask = await updateStatusService(requestId,status)
        res.status(200).json({
            message: 'Update status in request task success',
            data: requestTask
        })
    } catch (err) {
        next(err)
    }
}