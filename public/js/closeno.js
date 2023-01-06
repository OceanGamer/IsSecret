function startnotification() {
    const cch = document.getElementById("noti")
    cch.addEventListener("click", closenotification)
}

function closenotification() {
    const notificationobject = document.getElementById("chatfinalizado")
    notificationobject.style.display = "none"
}

window.addEventListener("load", startnotification)