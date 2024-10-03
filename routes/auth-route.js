const express = require("express");
const { login, currentUser } = require("../controllers/auth-controller");
const { loginValidator} = require("../middlewares/validator");
const { authenticate } = require("../middlewares/authenticate");
const authRoute = express.Router();


authRoute.post("/login",loginValidator, login)
authRoute.get("/me",authenticate,currentUser)


module.exports = authRoute