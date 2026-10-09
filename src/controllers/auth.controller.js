const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const emailService = require('../services/email.service')
const userRegisterController = async (req, res) => {

    const { email, name, password } = req.body

    const isExist = await userModel.findOne({ email })
    if (isExist) {
        return res.status(422).json({ message: "User already exist with Email", status: "failed" })
    }
    const user = await userModel.create({ email, name, password })
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })
    res.cookie("token", token)
    res.status(201).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name,
        },
        message: "User created successfully", status: "success", token
    })
    await emailService.sendRegistrationEmail(user.email, user.name)
}


const userLoginController = async (req, res) => {

    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required",
        });
    }
    const user = await userModel.findOne({ email }).select("+password")

    if (!user) {
        return res.status(401).json({
            message: "Email or password is INVALID"
        })
    }

    const isValidPassword = await user.comparePassword(password)

    if (!isValidPassword) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
    }
    // 4. Generate JWT
    const token = jwt.sign(
        {
            userId: user._id,
            name: user.name,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "3d",
        }
    );


    res.cookie("token", token)
    res.status(200).json({
        user: {
            _id: user._id,
            email: user.email,
            name: user.name,
        },
        message: "User Login successfully", status: "success", token
    })
}


async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }



    await tokenBlackListModel.create({
        token: token
    })

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out successfully"
    })

}

module.exports = { userRegisterController, userLoginController, userLogoutController }