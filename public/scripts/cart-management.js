const addToCartButton = document.querySelector("#product-details button")
const cartBadges = document.querySelectorAll(".nav-items .badge")

async function addToCart() {
    const productId = addToCartButton.dataset.productid

    try {
        const response = await fetch("/cart/items", {
            method: "POST",
            body: JSON.stringify({
                productId: productId
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!response.ok) {
            alert("Something went wrong")
            return
        }

        const responseData = await response.json()

        const newTotalQuantity = responseData.newTotalItems

        for (const badge of cartBadges) {
            badge.textContent = newTotalQuantity
        }

    } catch (error) {
        alert("Something went wrong")
        return
    }
}

addToCartButton.addEventListener("click", addToCart)