const db = require("mongodb")

const User = require("../models/user-model")
const authUtil = require("../util/authentication")
const validation = require("../util/validation")
const sessionFlash = require("../util/session-flash")

function getLogin(req, res) {
    let sessionData = sessionFlash.getSessionData(req)

    if (!sessionData) {
        sessionData = {
            email: null,
            password: null
        }
    }

    res.render("customer/auth/login", { inputData: sessionData })
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

    const sessionErrorData = {
        errorMessage: "Invalid credentials - please try again",
        email: user.email,
        password: user.password
    }

    if (!existingUser) {
        sessionFlash.flashDataToSession(req, sessionErrorData, function () {
            res.redirect("/login")
        })

        return
    }

    const passwordIsCorrect = await user.hasMatchingPassword(existingUser.password)

    if (!passwordIsCorrect) {
        sessionFlash.flashDataToSession(req, sessionErrorData, function () {
            res.redirect("/login")
        })

        return
    }

    authUtil.createUserSession(req, existingUser, function () {
        res.redirect("/")
    })
}

function getSignup(req, res) {
    let sessionData = sessionFlash.getSessionData(req)

    if (!sessionData) {
        sessionData = {
            email: null,
            password: null,
            confirmPassword: null,
            fullname: null,
            street: null,
            zip: null,
            city: null
        }
    }
    res.render("customer/auth/signup", { inputData: sessionData })
}

async function signup(req, res, next) {
    const enteredData = {
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body["confirm-password"],
        fullname: req.body.fullname,
        street: req.body.street,
        zip: req.body.zip,
        city: req.body.city
    }
    if (
        !validation.userDetailsAreValid(
            enteredData.email,
            enteredData.password,
            enteredData.fullname,
            enteredData.street,
            enteredData.zip,
            enteredData.city
        ) ||
        !validation.passwordIsConfirmed(
            enteredData.password,
            req.body["confirm-password"]
        )
    ) {
        sessionFlash.flashDataToSession(req, {
            errorMessage: "Please check your input.",
            ...enteredData
        }, function () {
            res.redirect("/signup")
        })

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
        const existsAlready = await user.existsAlready()

        if (existsAlready) {
            sessionFlash.flashDataToSession(req, {
                errorMessage: "User exists already, try logging in.",
                ...enteredData
            }, function () {
                res.redirect("/signup")
            })

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