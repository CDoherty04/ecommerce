function getLogin(req, res) {
    res.render("customer/auth/login")
}

function getSignup(req, res) {
    res.render("customer/auth/signup")
}

module.exports = {
    getSignup: getSignup,
    getLogin: getLogin
}