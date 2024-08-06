const bcrypt = require("bcryptjs")

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

    getUserWithSameEmail() {
        return db.getDb().collection("users").findOne({email: this.email})
    }

    hasMatchingPassword(hashword) {
        return bcrypt.compare(this.password, hashword)
    }j

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