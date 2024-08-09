const hamburger = document.getElementById("hamburger")
const mobileDisplay = document.getElementById("mobile-menu")

function toggleMobileMenu() {
    mobileDisplay.classList.toggle("open")
}

hamburger.addEventListener("click", toggleMobileMenu)