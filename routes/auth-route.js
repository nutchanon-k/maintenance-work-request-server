const express = require("express");
const { login, currentUser, forgotPassword, resetPassword } = require("../controllers/auth-controller");
const { loginValidator} = require("../middlewares/validator");
const { authenticate } = require("../middlewares/authenticate");
const authRoute = express.Router();


authRoute.post("/login",loginValidator, login)
authRoute.get("/me",authenticate,currentUser)



authRoute.post('/forgot-password', forgotPassword)
authRoute.patch('/reset-password',authenticate, resetPassword)


module.exports = authRoute