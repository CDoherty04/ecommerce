const cartItemUpdateForms = document.querySelectorAll(".cart-item-management")
const cartTotalPriceDisplay = document.getElementById("cart-total-price")
const cartBadges = document.querySelectorAll(".nav-items .badge")

async function updateCartItem(event) {
    event.preventDefault()

    const form = event.target

    const productId = form.dataset.productid
    const quantity = form.firstElementChild.value

    let response

    try {
        response = await fetch("/cart/items", {
            method: "PATCH",
            body: JSON.stringify({
                productId: productId,
                quantity: quantity
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
    } catch (error) {
        alert("Something went wrong")
        return
    }

    if (!response.ok) {
        alert("Something went wrong")
        return
    }

    const responseData = await response.json()

    if (responseData.updatedCartData.updatedItemPrice <= 0) {
        form.parentElement.parentElement.remove()
    } else {
        const cartItemTotalPriceDisplay =
            form.parentElement.querySelector(".cart-item-price")
        cartItemTotalPriceDisplay.textContent =
            responseData.updatedCartData.updatedItemPrice.toFixed(2)
    }

    cartTotalPriceDisplay.textContent = responseData.updatedCartData.newTotalPrice.toFixed(2)

    for (const badge of cartBadges) {
        badge.textContent = responseData.updatedCartData.newTotalQuantity
    }
}

for (const form of cartItemUpdateForms) {
    form.addEventListener("submit", updateCartItem)
}