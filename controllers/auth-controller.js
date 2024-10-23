require("dotenv").config();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const createError = require('../utils/create-error')
const { getUserByEmail, getUserById, changePasswordService } = require('../service/user-service');
const nodemailer = require('nodemailer');

//login
module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        // console.log(req.body)


        //check user by email
        const user = await getUserByEmail(email)
        if (!user) {
            return createError(400, 'email is not registered')
        }
        console.log(user)

        //compare password
        const passwordIsMatch = await bcrypt.compare(password, user.password)
        if (!passwordIsMatch) {
            return createError(400, 'email or password is incorrect')
        }

        //generate token
        const payload = { id: user.id }
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })


        //send token
        res.status(200).json({
            message: 'login success',
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                level: user.level,
                picture: user.picture
            }
        })

    } catch (err) {
        next(err)
    }
}
//get me for check role aan level for routing management (front-end)
exports.currentUser = async (req, res, next) => {
    try {
        const { id } = req.user
        const user = await getUserById(id)
        res.json(user)
    } catch (err) {
        next(err)
    }
}


//forgot password
exports.forgotPassword = async (req, res, next) => {
    try {
        const { emailForgetPassword } = req.body

        if (!emailForgetPassword) {
            return createError(400, 'email is required')
        }
        
        const user = await getUserByEmail(emailForgetPassword)

        if (!user) {
            return createError(400, 'email is not registered')
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '5m' });
        const resetURL = `http://localhost:5173/reset-password/${token}`;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL, // อีเมลของคุณ
                pass: process.env.PASSWORD // รหัสผ่านหรือรหัสผ่านสำหรับแอปของคุณ
            }
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL,
            subject: 'Reset Password',
            text: `You have requested to reset your password. Click the link below to reset your password: ${resetURL}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'email sent' });

    } catch (err) {
        next(err)
    }
}
exports.resetPassword = async (req, res, next) => {
    try {
        const { password, confirmPassword } = req.body
        const { id } = req.user
        if (password !== confirmPassword) {
            return createError(400, 'password is not match')
        }

        const user = await getUserById(id)
        if (!user) {    
            return createError(400, 'email is not registered')
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const result =  await changePasswordService(id, hashedPassword) 

        res.status(200).json({ message: 'reset password success' })

    } catch (err) {
        next(err)
    }
}