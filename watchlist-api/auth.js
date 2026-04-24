const jwt = require("jsonwebtoken")
require("dotenv").config()

function autenticar(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1]
      console.log("token recebido:", token) 
      console.log("secret:", process.env.JWT_SECRET)

    if (!token) return res.status(401).json({ erro: "Token não fornecido" })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.usuario = decoded
        next()
    } catch (err) {
        res.status(401).json({ erro: "Token invalido" })
    }
}

module.exports = autenticar