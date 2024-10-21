const express = require("express");
const { createUser, getUsersForAssign, getLocationDepartmentData, getUserId, changePassword } = require("../controllers/user-controller");
const { authenticate } = require("../middlewares/authenticate");
const { createUserValidator, updateUserValidator } = require("../middlewares/validator");
const { checkRoleAdmin } = require("../middlewares/check-role-admin");
const { getAllUsers } = require("../controllers/user-controller");
const { updateUser } = require("../controllers/user-controller");
const { deleteUser } = require("../controllers/user-controller");
const upload = require("../middlewares/upload");
const userRoute = express.Router();

//manage user by admin
userRoute.get("/all-users", checkRoleAdmin, getAllUsers )
userRoute.post("/", checkRoleAdmin,upload.single('picture'), createUserValidator, createUser)
userRoute.patch("/:userId", checkRoleAdmin,upload.single('picture'), updateUserValidator, updateUser)
userRoute.delete("/:userId", checkRoleAdmin,deleteUser )

//get user by leader for assign task
userRoute.get("/assign-users",getUsersForAssign)
userRoute.get("/location-department-data",checkRoleAdmin, getLocationDepartmentData) 
userRoute.get("/user-detail/:userId",checkRoleAdmin, getUserId) 


//for user change password
userRoute.patch("/change-password/:userId", authenticate, changePassword)


module.exports = userRoute