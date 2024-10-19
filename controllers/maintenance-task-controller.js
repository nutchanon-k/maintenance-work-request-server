
const createError = require('../utils/create-error');
const { getListMaintenanceTask, createMTask, updateMTask, deleteMTask, findTypeOfRootCause, getMaintenanceTaskById, updateMTaskStatus } = require('../service/maintenance-task-service');
const path = require('path')
const fs = require('fs/promises')
const cloudinary = require('../config/cloudinary')
const getPublicId = require('../utils/getPublicId');


module.exports.getMaintenanceTask = async (req, res, next) => {
    try {
        const { requestId, id, machineId, status, searchText } = req.query
        const role = req.user.role
        const level = req.user.level
        const userId = req.user.id

        // console.log(id)

        let requesterUserId = ''
        if (role === 'requester' && level === 'staff') {
            requesterUserId = userId
        }

        let maintenanceUserId = ''
        if (role === 'maintenance' && level === 'staff') {
            maintenanceUserId = userId
        }

        console.log( "test reqID",requestId)
        console.log("maintenanceTask ID", id )
        console.log("requester staff ID", requesterUserId )
        console.log("maintenance staff ID", maintenanceUserId )

        const maintenanceTasks = await getListMaintenanceTask(requestId, id, machineId, status, searchText, requesterUserId,maintenanceUserId)
        res.status(200).json({ data: maintenanceTasks })
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
        const role = req.user.role
        const level = req.user.level
        const userId = req.user.id

        //role validate
        if ((role === 'requester') && (role === 'maintenance' && level === 'staff')) {
            return createError(403, 'Only admin, maintenance leader or manager can create maintenance task')
        }


        const maintenanceTask = await createMTask(
            requestId,
            employeeId,
            machineId,
            typeOfFailureId,
            note
        )
        res.status(201).json({
            message: "Create Maintenance Task Success",
            data: maintenanceTask
        })
    } catch (err) {
        next(err)
    }
}
module.exports.updateMaintenanceTask = async (req, res, next) => {
    try {
        const { maintenanceId } = req.params
        const role = req.user.role
        const level = req.user.level
        const userId = req.user.id
        
        //check task is exist
        const maintenanceData = await getMaintenanceTaskById(maintenanceId)
        if (!maintenanceData) {
            return createError(404, 'Maintenance task not found')
        }

        //role validate
        if (role === 'requester') {
            return createError(403, 'Only admin, maintenance can edit maintenance task')
        }

        //only leader and manager and own task can update task
        if(role === 'maintenance' && level === 'staff' && userId !== maintenanceData.employeeId){
            return createError(403, 'Only own maintenance can edit maintenance task')
        }

        const {
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
            note

        } = req.body;
        // console.log("bodyyyyyyy",req.body)


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
            data: maintenanceTask
        })
    } catch (err) {
        next(err)
    }
}
module.exports.deleteMaintenanceTask = async (req, res, next) => {
    try {
        const { maintenanceId } = req.params
        const maintenanceData = await getMaintenanceTaskById(maintenanceId)
        if (!maintenanceData) {
            return createError(404, 'Maintenance task not found')
        }
        const maintenanceTask = await deleteMTask(maintenanceId)
        res.status(200).json({
            message: `Delete Maintenance Task ID ${maintenanceId} Success`,
            data: maintenanceTask
        })
    } catch (err) {
        next(err)
    }
}





//สำหรับดึงข้อมูลประเภทการเกิดปัญหา แบ่งตามประเภทการเสีย
module.exports.getTypeOfRootCause = async (req, res, next) => {
    try {
        const { typeOfFailureId, machineTypeId } = req.query
        const typeOfRootCause = await findTypeOfRootCause(typeOfFailureId, machineTypeId)
        res.status(200).json({
            message: `Get Type Of Root Cause Success`,
            data: typeOfRootCause
        })
    } catch (err) {
        next(err)
    }
}
//สำหรับอัพเดตสถานะการดําเนินการโดย requester
module.exports.updateMaintenanceTaskStatus = async (req, res, next) => {
    try {
        const { maintenanceId } = req.params
        const { status, acceptTime, isRejected, rejectReason } = req.body
        const role = req.user.role
        const level = req.user.level
        const userId = req.user.id

        //check task is exist
        const maintenanceData = await getMaintenanceTaskById(maintenanceId)
        if (!maintenanceData) {
            return createError(404, 'Maintenance task not found')
        }

        //change status only requester and admin
        if (role !== "requester" && role !== "admin") {
            return createError(401, 'Only requester and admin can change request task status')
        }

        //check own requester
        const requesterUserId = maintenanceData.requestTask.employeeId
        if (role === "requester" && level === "staff" && userId !== requesterUserId) {
            return createError(401, 'Only own requester can change task status')
        }



        console.log("from bodyyy", req.body)


        const fieldsToUpdate = {
            isRejected,
            rejectReason: rejectReason ? rejectReason : undefined,
            status: status,
            acceptTime: acceptTime
        };

        // ลบฟิลด์ที่เป็น undefined เพื่อไม่ให้ส่งไปยัง Prisma
        const cleanFieldsToUpdate = Object.fromEntries(
            Object.entries(fieldsToUpdate).filter(([key, value]) => value !== undefined)
        )
        console.log("from cleanFieldsToUpdate", cleanFieldsToUpdate)

        const maintenanceTask = await updateMTaskStatus(maintenanceId, cleanFieldsToUpdate)
        res.status(200).json({
            message: `Update Maintenance Task Status Success`,
            data: maintenanceTask
        })
    } catch (err) {
        next(err)
    }
}

