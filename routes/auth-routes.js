const express = require("express")
const authController = require("../controllers/auth-controller")

const router = express.Router()

router.get("/", function(req, res) {
    res.render("index")
})

router.get("/signup", authController.getSignup)

router.get("/login", authController.getLogin)

module.exports = router