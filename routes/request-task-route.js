const express = require("express");
const requestTaskRoute = express.Router();
const { authenticate } = require("../middlewares/authenticate");
const { createRequestTaskValidator, updateRequestTaskValidator } = require("../middlewares/validator");
const { createRequestTask, updateRequestTask, deleteRequestTask, getRequestTask, getMachine } = require("../controllers/request-task-controller");
const upload = require("../middlewares/upload");


requestTaskRoute.get("/", authenticate, authenticate, getRequestTask)
requestTaskRoute.post("/", authenticate,upload.single('image'), createRequestTaskValidator, createRequestTask)
requestTaskRoute.patch("/:requestId", authenticate,upload.single('image'), updateRequestTaskValidator,  updateRequestTask)
requestTaskRoute.delete("/:requestId", authenticate, deleteRequestTask)

requestTaskRoute.get("/data-machine/:machineId", authenticate, getMachine )

module.exports = requestTaskRoute