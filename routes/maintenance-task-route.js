const express = require("express");
const maintenanceTaskRoute = express.Router();
const { getMaintenanceTask, createMaintenanceTask, updateMaintenanceTask, deleteMaintenanceTask } = require("../controllers/maintenance-task-controller");
const { createMaintenanceTaskValidator, updateMaintenanceTaskValidator } = require("../middlewares/validator");

maintenanceTaskRoute.get("/", getMaintenanceTask)
maintenanceTaskRoute.post("/", createMaintenanceTaskValidator, createMaintenanceTask)
maintenanceTaskRoute.patch("/:maintenanceId", updateMaintenanceTaskValidator, updateMaintenanceTask)
maintenanceTaskRoute.delete("/:maintenanceId", deleteMaintenanceTask)

module.exports = maintenanceTaskRoute