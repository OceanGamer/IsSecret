const express = require("express")
const cors = require("cors")

const app = express()
app.use(express.static("public"))
app.use(cors())
app.use(express.json())
const usuarios = []
const chats = []
class Usuario {
    constructor(id,name) {
      this.id = id
      this.name = name
      this.id2 = ""
    }
}
class Chat {
    constructor(chatid,id1) {
      this.chatid = chatid
      this.id1 = id1
      this.mensajes = []
      this.origen = []
    }

    user2(id2) {
        this.id2 = id2
    }
}



app.get("/join/:nombre", (req, res) => {
    let nickname = req.params.nombre || ""
    let id = `${Math.random()}`
    let respond = 0
    if (nickname === "") {
        respond = 0
    } else {
        const usuario = new Usuario(id,nickname)
        usuarios.push(usuario)
        respond = 1
    }
    res.send({
        nickname: nickname,
        id: id,
        respond: respond
      })
})

app.get("/create/:id", (req, res) => {
    let id = req.params.id || ""
    let chatid = `${Math.random()}`
    if (id === "") {
        respond = 0
    } else {
        const chat = new Chat(chatid,id)
        chats.push(chat)
        respond = 1
    }
    res.send({
        chatid: chatid,
        respond: respond
      })
})

app.get("/verify/:chatid", (req, res) => {
    let chatid = req.params.chatid || ""
    let respond = "3"
    for (let i = 0; i < chats.length; i++) {
        if (chatid == chats[i].chatid) {
            let user1 = chats[i].id1
            let user2 = chats[i].id2
            if (user1 == null || user2 == null) {
                respond = "0"
            }else{
                respond = "1"
            }
        }
    }
    res.send(respond)
})

app.get("/joinchat/:chatid/:id", (req, res) => {
    let chatid = req.params.chatid || ""
    let id = req.params.id || ""
    let respond = "0"
    for (let i = 0; i < chats.length; i++) {
        if (chatid == chats[i].chatid) {
            chats[i].user2(id)
            respond = "1"
        }
    }
    res.send(respond)
})

app.get("/startchat/:chatid/:id", (req, res) => {
    let chatid = req.params.chatid || ""
    let id = req.params.id || ""
    let idk
    let index
    let nickname
    for (let i = 0; i < chats.length; i++) {
        if (chatid == chats[i].chatid) {
            index = i
            if (id == "1") {
                idk = chats[i].id1
            }else{
                idk = chats[i].id2
            }
        }
    }
    for (let i = 0; i < usuarios.length; i++) {
        if (idk == usuarios[i].id) {
            nickname = usuarios[i].name
        }
    }
    res.send({
        nickname: nickname,
        index: index
    })
})

app.post('/sendmensaje/:chatid/:userid', (req, res) => {
    const userid = req.params.userid || ""
    const chatid = req.params.chatid || ""
    const mensaje = req.body.value || ""
    for (let i = 0; i < chats.length; i++) {
        if (chatid == chats[i].chatid) {
            chats[i].mensajes.push(mensaje)
            chats[i].origen.push(userid)
        }
    }
})

app.get("/getchat/:chatid/:mensajeindex", (req, res) => {
    let chatid = req.params.chatid || ""
    let index0 = req.params.mensajeindex || ""
    let index = Number(index0)
    let respond = "0"
    let chat
    let origen 
    for (let i = 0; i < chats.length; i++) {
        if (chatid == chats[i].chatid) {
            if (chats[i].mensajes.length > index) {
                index = chats[i].mensajes.length
                chat = chats[i].mensajes
                origen = chats[i].origen
                respond = "2"
            }else{
                respond = "1"
            }
        }
    }
    res.send({
        respond: respond,
        chat: chat,
        origen: origen,
        index: index
    })
})

app.get('/deletechat/:chatid', (req, res) => {
    const chatid = req.params.chatid || ""
    for (let i = 0; i < chats.length; i++) {
        if (chatid == chats[i].chatid) {
            chats[i].chatid = 000000000
        }
    }
    res.send(chatid)
})

app.listen(8080, () => {
    console.log("IsSecret server started")
})