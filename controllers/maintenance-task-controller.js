const { request } = require('express');
const prisma = require('../models/prisma')
const createError = require('../utils/create-error');
const { getListMaintenanceTask, createMTask, updateMTask, deleteMTask } = require('../service/maintenance-task-service');

module.exports.getMaintenanceTask = async (req, res, next) => {
    try {
        const {requestId, employeeId, machineId } = req.query
        const maintenanceTasks = await getListMaintenanceTask(requestId, employeeId, machineId)
        res.status(200).json({data : maintenanceTasks})
    } catch (err) {
        next(err)
    }
}
module.exports.createMaintenanceTask = async (req, res, next) => {
    try {
        const {
            requestId, 
            employeeId, 
            machineId, 
            typeOfFailureId, 
            typeOfRootCauseId,
            rootCauseDetail,
            operationDetails ,
            preventingRecurrence,
            equipmentUsed,
            additionalSuggestions,
            image
        } = req.body
        const maintenanceTask = await createMTask(
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
        )
        res.status(201).json({data : maintenanceTask})
    } catch (err) {
        next(err)
    }
}
module.exports.updateMaintenanceTask = async (req, res, next) => {
    try {
        const {maintenanceId} = req.params
        const {
            requestId, 
            employeeId, 
            machineId, 
            typeOfFailureId, 
            typeOfRootCauseId,
            rootCauseDetail,
            operationDetails ,
            preventingRecurrence,
            equipmentUsed,
            additionalSuggestions,
            finishTime,
            acceptTime,
            isRejected,
            rejectReason,
            status,
            image
        } = req.body
        const maintenanceTask = await updateMTask(
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
        )
        res.status(200).json({data : maintenanceTask})
    } catch (err) {
        next(err)   
    }
}
module.exports.deleteMaintenanceTask = async (req, res, next) => {
    try {
        const {maintenanceId} = req.params
        const maintenanceTask = await deleteMTask(maintenanceId)
        res.status(200).json({
            message: "Delete Maintenance Task Success",
            data : maintenanceTask
        })
    } catch (err) {
        next(err)
    }
}
