const db = require("mongodb")

const User = require("../models/user-model")
const authUtil = require("../util/authentication")
const validation = require("../util/validation")

function getLogin(req, res) {
    res.render("customer/auth/login")
}

async function login(req, res, next) {
    const user = new User(req.body.email, req.body.password)
    let existingUser

    try {
        existingUser = await user.getUserWithSameEmail()
    } catch (error) {
        next(error)
        return
    }

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

async function signup(req, res, next) {
    if (
        !validation.userDetailsAreValid(
            req.body.email,
            req.body.password,
            req.body.name,
            req.body.street,
            req.body.postal,
            req.body.city
        ) ||
        !validation.passwordIsConfirmed(
            req.body.password,
            req.body["confirm-password"]
        )
    ) {
        res.redirect("/signup")
        return
    }

    const user = new User(
        req.body.email,
        req.body.password,
        req.body.fullname,
        req.body.street,
        req.body.zip,
        req.body.city)

    try {
        const existsAlready = await user.existsAlready

        if (existsAlready) {
            res.redirect("/login")
            return
        }
        await user.signup()
    } catch (error) {
        next(error)
        return
    }

    res.redirect("/login")
}

function logout(req, res) {
    authUtil.destroyUserAuthSession(req)
    res.redirect("/login")
}

module.exports = {
    getSignup: getSignup,
    getLogin: getLogin,
    signup: signup,
    login: login,
    logout: logout
}