const express = require("express");
const maintenanceTaskRoute = express.Router();
const { getMaintenanceTask, createMaintenanceTask, updateMaintenanceTask, deleteMaintenanceTask, getTypeOfRootCause, updateMaintenanceTaskStatus } = require("../controllers/maintenance-task-controller");
const { createMaintenanceTaskValidator, updateMaintenanceTaskValidator } = require("../middlewares/validator");
const upload = require("../middlewares/upload");

maintenanceTaskRoute.get("/", getMaintenanceTask)
maintenanceTaskRoute.post("/", createMaintenanceTaskValidator, createMaintenanceTask)
maintenanceTaskRoute.patch("/:maintenanceId",upload.single('image'), updateMaintenanceTaskValidator, updateMaintenanceTask)
maintenanceTaskRoute.delete("/:maintenanceId", deleteMaintenanceTask)


maintenanceTaskRoute.get("/data-type-of-root-cause",getTypeOfRootCause) 
maintenanceTaskRoute.patch("/update-status/:maintenanceId", updateMaintenanceTaskStatus)

module.exports = maintenanceTaskRoute