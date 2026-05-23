require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bcrypt = require("bcrypt")
const pool = require("./db")
const jwt = require("jsonwebtoken")
const autenticar = require("./auth")

const app = express()

app.use(cors())

app.use(express.json())

app.get("/", (req, res) => {
    res.json({ mensagem: "Api funcionando" })
})

app.post("/cadastro", async (req, res) => {
    const { nome, email, senha } = req.body

    try {
        const hash = await bcrypt.hash(senha, 10)

        await pool.query(
            "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)", [nome, email, hash]
        )
        res.json({ mensagem: "Usuario cadastro" })
    } catch (err) {
        console.log(err);
        res.status(400).json({ erro: "Email ja cadastrado" })
    }
})

app.post("/login", async (req, res) => {
    const { email, senha } = req.body

    try {
        const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]
        )
    const usuario = result.rows[0]
    if (!usuario) return res.status(404).json({ erro: "Usuario não encontrado" })
        
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

    if (!senhaCorreta) return res.status(401).json({ erro: "Senha incorreta" })
    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {expiresIn: "1d"})
    res.json({ token })
} catch (err) {
        res.status(500).json({ erro: "Erro no servidor" })
    }
})

app.get("/perfil", autenticar, (req, res) => {
    res.json({ mensagem: "Você está autenticado", usuario: req.usuario })
})

app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`)
})