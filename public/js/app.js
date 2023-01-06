// pages of issecret
const loadingPage = document.getElementById("loadingH")
const loadingFooter = document.getElementById("loadingF")
const perfilCreate = document.getElementById("perfilcreate")
const error = document.getElementById("error")
const codeerror = document.getElementById("codeerror")
const menuobject = document.getElementById("menu")
const appMenu = document.getElementById("appMenu")
const chatobj = document.getElementById("onchat")
const presentationobj = document.getElementById("nochat")
const loadingScreen = document.getElementById("loadingC")
const loadingScreenOther = document.getElementById("loadingA")
const notificationFi = document.getElementById("chatfinalizado")
const chatop = document.getElementById("chatop")
const chatdiv = document.getElementById("chatdiv")

const nameInput = document.getElementById("nameInput")
const codeInput = document.getElementById("codeInput")
const chatInput = document.getElementById("chatInput")
const co = document.getElementById("co")
const ca = document.getElementById("ca")
const cc = document.getElementById("cc")
const cj = document.getElementById("cj")
const om = document.getElementById("om")
const cm = document.getElementById("cm")
const em = document.getElementById("em")
const cb = document.getElementById("cb")
const cch = document.getElementById("cch")
const copycode = document.getElementById("copycode")
let nickname
let othernick
let id
let chatid
let userid
let chatindex
let menu = false
let mensajeindex
function openCloseMenu(){
    if (menu === false) {
        menuobject.style.display = "block"
        menu = true
    } else {
        menuobject.style.display = "none"
        menu = false
    }
    return
}

//espera unos segundos antes de inciar la pagina
function iniciarApp() {
    setTimeout(() => { waitJoin() }, 3000);
}

//join zone
function waitJoin() {
    chatobj.style.display = "none"
    perfilCreate.style.display = "flex"
    loadingPage.style.display = "none"
    loadingFooter.style.display = "none"
    error.style.display = "none"
    chatop.style.display = "none"
    co.addEventListener("click", join)
}

function join(){
    let value = nameInput.value
    if (value != "") {
        fetch("http://192.168.1.109:8080/join/" + value)
        .then(function (res) {
            if (res.ok) {
                res.json()
                    .then(function(respond){
                        if (respond.respond == 1) {
                            nickname = respond.nickname
                            id = respond.id
                            menupage()
                        } else {
                            let error = document.getElementById("error")
                            error.innerHTML = "ERROR: Coloque un nombre para continuar!"
                        }
                    })
            }
        })
    } else {
        let error = document.getElementById("error")
        error.innerHTML = "ERROR: Coloque un nombre para continuar!"
    }
}

function menupage() {
    loadingScreen.style.display = "none"
    loadingScreenOther.style.display = "none"
    perfilCreate.style.display = "none"
    appMenu.style.display = "flex"
    presentationobj.style.display = "flex"
    chatobj.style.display = "none"
    chatop.style.display = "none"
    cc.addEventListener("click", createchat)
    cj.addEventListener("click", joinchat)
}

function createchat() {
    fetch("http://192.168.1.109:8080/create/"+id)
        .then(function (res) {
            if (res.ok) {
                res.json()
                    .then(function(respond){
                        if (respond.respond == 1) {
                            chatid = respond.chatid
                            lobbycreate()
                        } else {
                            
                        }
                    })
            }
        })
}

function lobbycreate() {
    cb.addEventListener("click", deletechat)
    loadingScreen.style.display = "flex"
    appMenu.style.display = "none"
    let codezone = document.getElementById("codezone")
    let codezonehidden = document.getElementById("codezonehidden")
    codezone.innerHTML = chatid
    codezonehidden.value = chatid
    userid = "1"
    intervalo = setInterval(verifysesion, 100)
}

function joinchat() {
    let value = codeInput.value
    if (value != "") {
        fetch("http://192.168.1.109:8080/joinchat/"+value+"/"+id)
        .then(function (res) {
        if (res.ok) {
            res.json()
                .then(function(respond){
                    if (respond == "0") {
                        codeerror.innerHTML = "ERROR: El chat no existe!"
                    } else {
                        userid = "2"
                        chatid = value
                        startchat()
                    }
                })
            }
        })
    } else {
        codeerror.innerHTML = "ERROR: Coloque un codigo de invitacion!"
    }
}


function deletechat() {
    clearInterval(intervalo)
    fetch("http://192.168.1.109:8080/deletechat/"+chatid)
    .then(function (res) {
        if (res.ok) {
            res.json()
                .then(function(respond){

                })
            }
        })
    menupage()
}

function verifysesion() {
    fetch("http://192.168.1.109:8080/verify/"+chatid)
    .then(function (res) {
        if (res.ok) {
            res.json()
                .then(function(respond){
                    if (respond == "0") {
                        
                    } else if (respond == "1") {
                        clearInterval(intervalo)
                        startchat()
                    } else {
                        alert("Error del servidor")
                    }
                })
        }
    })
}

function startchat() {
    let finaluser
    if (userid == "1") {
        finaluser = "2"
    }
    if (userid == "2") {
        finaluser = "1"
    }
    fetch("http://192.168.1.109:8080/startchat/"+chatid+"/"+finaluser)
    .then(function (res) {
        if (res.ok) {
            res.json()
                .then(function(respond){
                    chatindex = respond.index
                    othernick = respond.nickname
                    loadingScreen.style.display = "none"
                    presentationobj.style.display = "none"
                    appMenu.style.display = "none"
                    chatobj.style.display = "block"
                    chatop.style.display = "flex"
                    let namezone = document.getElementById("namenick")
                    namezone.innerHTML = othernick
                    mensajeindex = 0
                    onchat()
                })
        }
    })
}


function onchat() {
    om.addEventListener("click", openCloseMenu)
    cm.addEventListener("click", openCloseMenu)
    em.addEventListener("click", sendMensaje)
    cch.addEventListener("click", deletechat)
    document.addEventListener('keydown', function(event) {
        if (event.code == 'Enter' ) {
          sendMensaje()
        }
    });
    intervalo = setInterval(getMensajes, 1000)
    //salir del chat
    //cerrar sesion
    

}

function sendMensaje() {
    let value = chatInput.value
    if (value == "") {

    } else {
    fetch("http://192.168.1.109:8080/sendmensaje/" + chatid + "/" + userid,{
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            value: value
        })
    })
    chatInput.value = null
    mensajeindex = mensajeindex + 1
    añadirmensaje(userid,value)
    }
}

function añadirmensaje(autor,mensaje) {
    let mensajebuilder
    let now = new Date();
    let hour = now.getHours()
    let minutes = now.getMinutes()
    if (minutes == 0) {
        minutes = "00"
    }
    if (autor == userid) {
        mensajebuilder = '<div class="yourMensaje"><span>Tu - '+hour+':'+minutes+'</span><p>'+mensaje+'</p></div>'
        chatdiv.innerHTML += mensajebuilder
    } else {
        mensajebuilder = '<div class="otherMensaje"><span>'+othernick+' - '+hour+':'+minutes+'</span><p>'+mensaje+'</p></div>'
        chatdiv.innerHTML += mensajebuilder
    }
}

function getMensajes() {
    fetch("http://192.168.1.109:8080/getchat/"+chatid+"/"+mensajeindex)
    .then(function (res) {
        if (res.ok) {
            res.json()
                .then(function(respond){
                    let newrespond = respond.respond || ""
                    if (newrespond == "1") {
                        
                    } else if (newrespond == "2") {
                        let newindex = respond.index || ""
                        let neworigen = respond.origen || ""
                        let newchat = respond.chat || ""
                        for (let i = mensajeindex; i < newchat.length; i++) {
                            let creator = neworigen[i]
                            let mensaje = newchat[i]
                            añadirmensaje(creator,mensaje)
                        }
                        mensajeindex = newindex
                    } else if (newrespond == "0") {
                        clearInterval(intervalo)
                        notificationFi.style.display = "block"
                        menupage()
                    }
                })
        }
    })
}
chatobj.style.display = "none"
chatop.style.display = "none"
notificationFi.style.display = "none"
appMenu.style.display = "none"
menuobject.style.display = "none"
perfilCreate.style.display = "none"
loadingScreen.style.display = "none"
loadingScreenOther.style.display = "none"
window.addEventListener("load", iniciarApp)