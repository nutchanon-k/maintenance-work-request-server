const express = require("express");
const requestTaskRoute = express.Router();
const { authenticate } = require("../middlewares/authenticate");
const { createRequestTaskValidator, updateRequestTaskValidator, updateIsAssignValidator, updateRequestTaskStatusValidator } = require("../middlewares/validator");
const { createRequestTask, updateRequestTask, deleteRequestTask, getRequestTask, getMachine, updateRequestTaskIsAssign, updateRequestStatus } = require("../controllers/request-task-controller");
const upload = require("../middlewares/upload");


requestTaskRoute.get("/", authenticate, authenticate, getRequestTask)
requestTaskRoute.post("/", authenticate,upload.single('image'), createRequestTaskValidator, createRequestTask)
requestTaskRoute.patch("/:requestId", authenticate,upload.single('image'), updateRequestTaskValidator,  updateRequestTask)
requestTaskRoute.delete("/:requestId", authenticate, deleteRequestTask)

// for get data machine for show in request form
requestTaskRoute.get("/data-machine/:machineId", authenticate, getMachine )

// for update isAssigned after create maintenance task
requestTaskRoute.patch("/isAssigned/:requestId", authenticate,updateIsAssignValidator, updateRequestTaskIsAssign)

//for update status after finish all maintenance task
requestTaskRoute.patch("/update-status/:requestId", authenticate,updateRequestTaskStatusValidator, updateRequestStatus)

module.exports = requestTaskRoute