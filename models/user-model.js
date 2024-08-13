const bcrypt = require("bcryptjs")
const mongodb = require("mongodb")

const db = require("../data/database")

class User {
    constructor(email, password, name, street, postal, city) {
        this.email = email
        this.password = password
        this.name = name
        this.address = {
            street: street,
            postal: postal,
            city: city
        }
    }

    static findById(userId) {
        const uid = new mongodb.ObjectId(userId)

        return db.getDb().collection("users").findOne({ _id: uid }, { projection: { password: 0 } })
    }

    getUserWithSameEmail() {
        return db.getDb().collection("users").findOne({ email: this.email })
    }

    async existsAlready() {
        return await this.getUserWithSameEmail()
    }

    hasMatchingPassword(hashword) {
        return bcrypt.compare(this.password, hashword)
    } j

    async signup() {
        const hashword = await bcrypt.hash(this.password, 12)

        db.getDb().collection("users").insertOne({
            email: this.email,
            password: hashword,
            name: this.name,
            address: this.address
        })
    }
}

module.exports = User