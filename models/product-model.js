const mongodb = require("mongodb")

const db = require("../data/database")

class Product {
    constructor(productData) {
        this.title = productData.title
        this.image = productData.image
        this.summary = productData.summary
        this.price = +productData.price
        this.description = productData.description
        this.updateImageData()
        if (productData._id) {
            this.id = productData._id.toString()
        }
    }

    static async findAll() {
        const products = await db.getDb().collection("products").find().toArray()

        return products.map(function (productDocument) {
            return new Product(productDocument)
        })
    }

    static async findByID(productID) {
        let prodId
        try {
            prodId = mongodb.ObjectId.createFromHexString(productID)
        } catch (error) {
            error.code = 404
            throw error
        }
        const product = await db.getDb().collection("products").findOne({ _id: prodId })

        if (!product) {
            const error = new Error("Could not find product with given ID")
            error.code = 404
            throw error
        }
        return new Product(product)
    }

    updateImageData() {
        this.imagePath = `product-data/images/${this.image}`
        this.imageURL = `/products/assets/images/${this.image}`
    }

    async save() {
        const productData = {
            title: this.title,
            summary: this.summary,
            price: this.price,
            description: this.description,
            image: this.image
        }

        if (this.id) {
            const productId = mongodb.ObjectId.createFromHexString(this.id)

            if (!this.image) {
                delete productData.image
            }
            
            await db.getDb().collection("products").updateOne(
                { _id: productId },
                {
                    $set: productData
                }
            )
        } else {
            await db.getDb().collection("products").insertOne(productData)
        }
    }

    async replaceImage(newImage) {
        this.image = newImage
        this.updateImageData()
    }
}

module.exports = Product