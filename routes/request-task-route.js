const express = require("express");
const requestTaskRoute = express.Router();
const { authenticate } = require("../middlewares/authenticate");
const { createRequestTaskValidator, updateRequestTaskValidator } = require("../middlewares/validator");
const { createRequestTask, updateRequestTask, deleteRequestTask, getRequestTask } = require("../controllers/request-task-controller");


requestTaskRoute.get("/", authenticate, authenticate, getRequestTask)
requestTaskRoute.post("/", authenticate, createRequestTaskValidator, createRequestTask)
requestTaskRoute.patch("/:requestId", authenticate, updateRequestTaskValidator,  updateRequestTask)
requestTaskRoute.delete("/:requestId", authenticate, deleteRequestTask)


module.exports = requestTaskRoute