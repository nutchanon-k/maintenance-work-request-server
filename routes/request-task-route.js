const express = require("express");
const requestTaskRoute = express.Router();
const { authenticate } = require("../middlewares/authenticate");


requestTaskRoute.get("/", authenticate, (req, res) => {})
requestTaskRoute.post("/", authenticate, (req, res) => {})
requestTaskRoute.patch("/:requestId", authenticate, (req, res) => {})
requestTaskRoute.delete("/:requestId", authenticate, (req, res) => {})


module.exports = requestTaskRoute