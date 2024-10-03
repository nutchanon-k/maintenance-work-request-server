const express = require("express");
const { createUser, getUsers } = require("../controllers/user-controller");
const { authenticate } = require("../middlewares/authenticate");
const { createUserValidator, updateUserValidator } = require("../middlewares/validator");
const { checkRoleAdmin } = require("../middlewares/check-role-admin");
const { getAllUsers } = require("../controllers/user-controller");
const { updateUser } = require("../controllers/user-controller");
const { deleteUser } = require("../controllers/user-controller");
const userRoute = express.Router();

//manage user by admin
userRoute.get("/all-users",authenticate, checkRoleAdmin, getAllUsers )
userRoute.post("/", authenticate, checkRoleAdmin, createUserValidator, createUser)
userRoute.patch("/:userId", authenticate, checkRoleAdmin, updateUserValidator, updateUser)
userRoute.delete("/:userId",authenticate, checkRoleAdmin,deleteUser )

//get user by leader for assign task
userRoute.get("/list-users", authenticate,getUsers)





module.exports = userRoute