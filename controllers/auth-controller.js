const db = require("mongodb")

const User = require("../models/user-model")
const authUtil = require("../util/authentication")

function getLogin(req, res) {
    res.render("customer/auth/login")
}

async function login(req, res) {
    const user = new User(req.body.email, req.body.password)
    const existingUser = await user.getUserWithSameEmail()

    if (!existingUser) {
        return res.redirect("/login")
    }

    const passwordIsCorrect = user.hasMatchingPassword(existingUser.password)

    if (!passwordIsCorrect) {
        return res.redirect("/login")
    }

    authUtil.createUserSession(req, existingUser, function () {
        res.redirect("/")
    })
}

function getSignup(req, res) {
    res.render("customer/auth/signup")
}

async function signup(req, res) {
    const user = new User(
        req.body.email,
        req.body.password,
        req.body.fullname,
        req.body.street,
        req.body.zip,
        req.body.city)

    await user.signup()

    res.redirect("/login")
}

module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    signup: signup,
    login: login
}