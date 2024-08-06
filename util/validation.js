const e = require("express")

function isEmpty(value) {
    return !value || value.trim() === ""
}

function userCredentialsAreValid(email, password) {
    return (
        email &&
        email.includes("@") &&
        password &&
        password.trim().length > 5
    )
}

function userDetailsAreValid(email, password, name, street, postal, city) {
    return (
        userCredentialsAreValid(email, password) &&
        !isEmpty(name) &&
        !isEmpty(street) &&
        !isEmpty(postal) &&
        !isEmpty(city)
    )
}

function passwordIsConfirmed(password, confirmPassword) {
    return password === confirmPassword
}

module.exports = {
    userDetailsAreValid: userDetailsAreValid,
    passwordIsConfirmed: passwordIsConfirmed
}