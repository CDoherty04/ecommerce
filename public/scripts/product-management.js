const deleteProductButtons = document.querySelectorAll(".product-item button")

async function deleteProduct(event) {
    const button = event.target
    const productId = button.dataset.productid
    const productTitle = button.dataset.producttitle

    if (confirm(`Delete ${productTitle}?`)) {
        const response = await fetch("/admin/products/" + productId, {
            method: "DELETE"
        })

        if (!response.ok) {
            alert("Couldn't delete product")
            alert(productId)
            return
        }

        button.parentElement.parentElement.parentElement.parentElement.remove()

    } else {
        console.log('User chose to not delete product');
    }


}

for (const deleteProductButton of deleteProductButtons) {
    deleteProductButton.addEventListener("click", deleteProduct)
}