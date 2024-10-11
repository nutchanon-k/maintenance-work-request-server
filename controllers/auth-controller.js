const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const createError = require('../utils/create-error')
const { getUserByEmail, getUserById } = require('../service/user-service')


module.exports.login = async(req, res, next) => {
    try{
        const { email, password } = req.body
        // console.log(req.body)

        
        //check user by email
        const user = await getUserByEmail(email)
        if (!user) {
            return createError(400, 'email is not registered')
        }

        //compare password
        const passwordIsMatch = await bcrypt.compare(password, user.password)
        if (!passwordIsMatch) {
            return createError(400, 'email or password is incorrect')
        }

         //generate token
        const payload = {id: user.id}
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' })


        //send token
        res.status(200).json({
            message: 'login success',
            token,
            user:{
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role : user.role,
                level : user.level
            }
        })
      
    }catch(err){
        next(err)
    }
}
exports.currentUser = async (req, res, next) => {
    try {
        const { id } = req.user
        const user = await getUserById(id)
        res.json(user)
    } catch (err) {
        next(err)
    }
}