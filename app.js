const path = require("path")
const express = require("express")
const expressSession = require("express-session")

const db = require("./data/database")
const baseRoutes = require("./routes/base-routes")
const authRoutes = require("./routes/auth-routes")
const productRoutes = require("./routes/product-routes")
const adminRoutes = require("./routes/admin-routes")

const errorHandlerMiddleware = require("./middlewares/error-handler")
const createSessionConfig = require("./config/session")
const checkAuthStatus = require("./middlewares/check-auth")

const app = express()

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use(express.static("public"))
app.use("/products/assets", express.static("product-data"))
app.use(express.urlencoded({ extended: false }))

const sessionConfig = createSessionConfig()

app.use(expressSession(sessionConfig))

app.use(checkAuthStatus)

app.use(baseRoutes)
app.use(authRoutes)
app.use(productRoutes)
app.use("/admin", adminRoutes)

app.use(errorHandlerMiddleware)

db.connectToDatabase()
    .then(function () {
        app.listen(3000)
    })
    .catch(function (error) {
        console.log("Failed to connect to the database")
        console.log(error)
    })