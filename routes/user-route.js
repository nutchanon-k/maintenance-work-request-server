const express = require("express");
const { createUser, getUsersForAssign } = require("../controllers/user-controller");
const { authenticate } = require("../middlewares/authenticate");
const { createUserValidator, updateUserValidator } = require("../middlewares/validator");
const { checkRoleAdmin } = require("../middlewares/check-role-admin");
const { getAllUsers } = require("../controllers/user-controller");
const { updateUser } = require("../controllers/user-controller");
const { deleteUser } = require("../controllers/user-controller");
const userRoute = express.Router();

//manage user by admin
userRoute.get("/all-users", checkRoleAdmin, getAllUsers )
userRoute.post("/", checkRoleAdmin, createUserValidator, createUser)
userRoute.patch("/:userId", checkRoleAdmin, updateUserValidator, updateUser)
userRoute.delete("/:userId", checkRoleAdmin,deleteUser )

//get user by leader for assign task
userRoute.get("/assign-users",getUsersForAssign)





module.exports = userRoute