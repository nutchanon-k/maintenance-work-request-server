const { request } = require('express');
const prisma = require('../models/prisma')
const createError = require('../utils/create-error');
const { getListMaintenanceTask, createMTask, updateMTask, deleteMTask, findTypeOfRootCause, getMaintenanceTaskById } = require('../service/maintenance-task-service');
const path = require('path')
const fs = require('fs/promises')
const cloudinary = require('../config/cloudinary')
const getPublicId = require('../utils/getPublicId')

module.exports.getMaintenanceTask = async (req, res, next) => {
    try {
        const {requestId, id, employeeId, machineId, status } = req.query
        const maintenanceTasks = await getListMaintenanceTask(requestId, id, employeeId, machineId, status)
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
            note 
        } = req.body
        const maintenanceTask = await createMTask(
            requestId, 
            employeeId, 
            machineId, 
            typeOfFailureId,
            note 
        )
        res.status(201).json({
            message: "Create Maintenance Task Success",
            data : maintenanceTask})
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
            note
            
        } = req.body;
        // console.log("bodyyyyyyy",req.body)
        const maintenanceData = await getMaintenanceTaskById(maintenanceId)
        if (!maintenanceData) {
            return createError(404, 'Maintenance task not found')
        }

        // ตรวจสอบและแปลงเฉพาะค่าที่มีให้เป็น number ถ้าเป็นค่าที่สามารถแปลงได้
        const fieldsToUpdate = {
            requestId: requestId ? Number(requestId) : undefined,
            employeeId: employeeId ? Number(employeeId) : undefined,
            machineId: machineId ? Number(machineId) : undefined,
            typeOfFailureId: typeOfFailureId ? Number(typeOfFailureId) : undefined,
            typeOfRootCauseId: typeOfRootCauseId ? Number(typeOfRootCauseId) : undefined,
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
            note
            
        };

        // ลบฟิลด์ที่เป็น undefined เพื่อไม่ให้ส่งไปยัง Prisma
        const cleanFieldsToUpdate = Object.fromEntries(
            Object.entries(fieldsToUpdate).filter(([key, value]) => value !== undefined)
        );


        // check file image
        const haveFile = !!req.file
        let uploadResult = {}
        if (haveFile) {
            uploadResult = await cloudinary.uploader.upload(req.file.path, {
                public_id: path.parse(req.file.path).name
            })
            fs.unlink(req.file.path)
            // console.log("maintenanceData", maintenanceData)
            if (maintenanceData.image) {
                cloudinary.uploader.destroy(getPublicId(maintenanceData.image))
            }
            cleanFieldsToUpdate.image = uploadResult.secure_url || null
        }

        
        // console.log("cleanFieldsToUpdate", cleanFieldsToUpdate)
        // อัปเดตข้อมูลในฐานข้อมูล
        const maintenanceTask = await updateMTask(maintenanceId, cleanFieldsToUpdate);
        
        // const {
        //     requestId, 
        //     employeeId, 
        //     machineId, 
        //     typeOfFailureId, 
        //     typeOfRootCauseId,
        //     rootCauseDetail,
        //     operationDetails ,
        //     preventingRecurrence,
        //     equipmentUsed,
        //     additionalSuggestions,
        //     finishTime,
        //     acceptTime,
        //     isRejected,
        //     rejectReason,
        //     status,
        //     image
        // } = req.body
        // const maintenanceTask = await updateMTask(
        //     maintenanceId,
        //     requestId,
        //     employeeId,
        //     machineId,
        //     typeOfFailureId,
        //     typeOfRootCauseId,
        //     rootCauseDetail,
        //     operationDetails,
        //     preventingRecurrence,
        //     equipmentUsed,
        //     additionalSuggestions,
        //     finishTime,
        //     acceptTime,
        //     isRejected,
        //     rejectReason,
        //     status,
        //     image
        // )
        res.status(200).json({
            message: `Update Maintenance Task ID ${maintenanceId} Success`,
            data : maintenanceTask
        })
    } catch (err) {
        next(err)   
    }
}
module.exports.deleteMaintenanceTask = async (req, res, next) => {
    try {
        const {maintenanceId} = req.params
        const maintenanceTask = await deleteMTask(maintenanceId)
        res.status(200).json({
            message: `Delete Maintenance Task ID ${maintenanceId} Success`,
            data : maintenanceTask
        })
    } catch (err) {
        next(err)
    }
}





//สำหรับดึงข้อมูลประเภทการเกิดปัญหา แบ่งตามประเภทการเสีย
module.exports.getTypeOfRootCause = async (req, res, next) => {
    try {
        const {typeOfFailureId, machineTypeId} = req.query
        const typeOfRootCause = await findTypeOfRootCause(typeOfFailureId, machineTypeId)
        res.status(200).json({
            message: `Get Type Of Root Cause Success`,
            data : typeOfRootCause
        })
    } catch (err) {
        next(err)
    }
}