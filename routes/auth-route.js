const express = require("express");
const { register, login } = require("../controllers/auth-controller");
const { loginValidator } = require("../middlewares/validator");
const authRoute = express.Router();

authRoute.post("/register", register)
authRoute.post("/login",loginValidator, login)


module.exports = authRoute