import { useState, useEffect, createContext, useContext } from "react"
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link, Navigate } from "react-router-dom"

const API_KEY = "332d9c67"


function RotaProtegida({ children }) {
  const token = localStorage.getItem("token")
  if (!token) return <Navigate to="/login" />
  return children
}

function Cadastro() {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const navigate = useNavigate()

  async function handleCadastro() {
    try {
      const res = await fetch("http://localhost:3000/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha })
      })
      const data = await res.json()
      alert(data.mensagem)
      navigate("/login")
    } catch (err) {
      alert("erro no cadastro")
    }
  }
  return (
    <div className="d-flex justify-content-center align-items-center text-light">
      <div className="mt-5 w-25">
        <div className="mb-4">
          <h1 className="text-center">Criar conta</h1>
        </div>
        <div>
          <label className="form-label">Nome</label>
          <input className="form-control" value={nome} onChange={e => setNome(e.target.value)} placeholder="Digite seu nome" />
        </div>
        <div>
          <label className="form-label">Email</label>
          <input className="form-control" type="email" onChange={e => setEmail(e.target.value)} placeholder="Digite seu email" />
        </div>
        <div>
          <label className="form-label">Senha</label>
          <input className="form-control" type="password" onChange={e => setSenha(e.target.value)} placeholder="Digite sua senha" />
        </div>
        <div>
          <button className="btn bg-danger bg-gradient bg-opacity-100 w-100 mt-5" onClick={handleCadastro}>Cadastrar</button>
        </div>
        <p>Já tem uma conta? <Link to="/login">Entrar</Link></p>
      </div>
    </div>
  )

}



function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")

  async function handleLogin() {
    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.erro)
        return
      }
      localStorage.setItem("token", data.token)
      navigate("/")
    } catch (err) {
      alert("Erro no login")
    }
  }
  return (
    <div className="d-flex justify-content-center align-items-center text-light">
      <div className="w-25">
        <div className="w-0">
          <h1 className="mb-5 mt-5 text-center">Acesse sua conta</h1> 
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="jonh@gmail.com" />
        </div>
        <div className="mb-1">
          <label className="form-label">Senha</label>
          <input className="form-control" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Senha" type="password"/>
        </div>
        <div className="d-flex mt-5 justify-content-center align-items-center"> 
          <button className="btn bg-danger bg-gradient bg-opacity-100 w-100" onClick={handleLogin}>Entrar</button>
        </div>
          <p className="mt-2">Não possui uma conta? <Link to="/cadastro">Cadastre-se</Link></p>
      </div>
    </div>
  )
}




function Home() {
  const navigate = useNavigate()
  const [filmes, setFilmes] = useState([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState("Batman")
  
  useEffect(() => {
    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${busca}`)
    .then(res => res.json())
    .then(data => {
      setFilmes(data.Search || [])
      setLoading(false)
    })
  }, [busca])
  
  
  if (loading) return (
  <div className="d-flex justify-content-center">
    <div className="spinner-border" role="status" style={{ color: "white" }}>
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
  )
  
  function logout() {
    localStorage.removeItem("token")
    navigate("/login")
  }


  return (
    <div>
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark rounded-bottom-4 border-bottom border-danger border-3">
        <div className="container-fluid" style={{ background: "None"}}>
          <a href="" className="navbar-brand text-danger fw-semibold" style={{ background: "None"}}>Watchlist</a>
          <div className="collapse navbar-collapse" style={{ background: "None"}}>
            <div className="navbar-nav" style={{ background: "None"}}>
              <Link to="/favoritos" className="nav-link text-danger fw-medium">Favoritos</Link>
            </div>
          </div>
          <form className="d-flex" style={{ background: "None"}}>
            <input className="form-control navbar-text me-2 border-danger border-2 fw-lighter" type="text" value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar filme..." />
          </form>
          <div className="dropdown" style={{ background: "None" }}>
            <i 
              className="bi bi-person-circle fs-3 text-white dropdown-toggle" 
              data-bs-toggle="dropdown" 
              style={{ cursor: "pointer", background: "None" }}
            ></i>
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark">
              <li style={{ background: "None"}}><span className="dropdown-item text-light">Minha conta</span></li>
              <li><hr className="dropdown-divider" /></li>
              <li style={{ background: "None"}}><button className="dropdown-item text-danger" onClick={logout}>Sair</button></li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container col-9 mx-auto mt-5">
      <div className="row row-cols-1 row-cols-md-4 g-2 justify-content-center" style={{ height: "60rem" }}>
        {filmes.map(filme => (
        <div className="col" key={filme.imdbID} onClick={() => navigate(`filme/${filme.imdbID}`)} style={{ cursor: "pointer" }}>
          <div className="card h-100 border-0" style={{ backgroundColor: "#000000"}}>
            <img src={filme.Poster} className="card-img-top img-fluid" alt={filme.Title}/>
            <div className="card-body">
              <h5 className="card-title fw-bold text-uppercase">{filme.Title}</h5>
            <div className="bottom-100">
              <p className="card-text p-0" style={{ backgroundColor: "rgb(20, 20, 20)"}}>{filme.Year} - {filme.Type === "movie" ? "Filme" : "Serie"}</p>
            </div>
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
    </div>
  )
  
}
function Detalhes() {
  const { id } = useParams()
  const { favoritos, toggleFavoritos } = useContext(FavoritosContext)
  const [filme, setFilme] = useState(0)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`)
    .then(res => res.json())
    .then(data => {
      setFilme(data)
      setLoading(false)
    })
  }, [id])
  if (loading) return (
    <div className="d-flex justify-content-center">
    <div className="spinner-border" role="status" style={{ color: "white" }}>
      <span className="visually-hidden">Loading...</span>
    </div>
    </div>
  )

  const ehFavoritos = favoritos.find(f => f.imdbID === filme.imdbID)

  return (
  <div className="d-flex justify-content-center align-center-items">
  <div className="card mb-3 border-0" style={{ maxWidth: "1000px" }}>
    <div className="row g-0">
      <div className="col-md-4 position-relative">
        <img className="img-fluid rounded-start" src={filme.Poster} alt={filme.Title} />
        <i onClick={() => toggleFavoritos(filme)} className={`bi bi-heart-fill fs-3 text-danger position-absolute start-0 top-0 m-2 ${ehFavoritos ? "text-danger" : "text-white"}`} style={{ background: "None"}}></i>
      </div>
      <div className="col-md-8">
        <div className="card-body" style={{ backgroundColor: "black" }}>
          <h2 className="card-title fw-bold">{filme.Title}</h2>
          <hr />
          <h4 className="card-title fw-bold">Sobre o Filme</h4>
          <p className="card-text"><strong>Data de estreia</strong> {filme.Year}</p>
          <hr />
          <p className="card-text"><strong>Distribuido por</strong>   {filme.Production}</p>
          <hr />
          <p className="card-text"><strong>Nota IMDb</strong>    {filme.imdbRating}</p>
      </div>
    </div>
    <p className="text-start text-sm-start mt-3" style={{ width: "350px"}}>{filme.Plot}</p>
  </div>
</div>
<div className="card mb-3" style={{ maxWidth: "18rem", backgroundColor: "rgb(0, 0, 0)"}}>
  <div id="card1" className="card-body" style={{ backgroundColor: "black "}}>
    <h5 className="card-title fw-bold" style={{ backgroundColor: "black"}}>Elenco e Equipe</h5>
    <hr />
    <p><strong>Diretor</strong> {filme.Director}</p>
    <p><strong>Elenco</strong> {filme.Actors}</p>
  </div>
</div>
</div>
  )
}

const FavoritosContext = createContext()

function FavoritosProvider({ children }) {
  const [favoritos, setFavorites] = useState([])

  function toggleFavoritos(filme) {
    const capture = favoritos.find(f => f.imdbID === filme.imdbID)
    if (capture) {
      setFavorites(favoritos.filter(f => f.imdbID !== filme.imdbID))
    }
    else {
      setFavorites([...favoritos, filme])
    }
  }
  return (
    <FavoritosContext.Provider value={{ favoritos, toggleFavoritos }}>
      {children}
    </FavoritosContext.Provider>
  )
}


function Favoritos() {
  const navigate = useNavigate()
  const { favoritos } = useContext(FavoritosContext)

  return (
    <div>
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark rounded-bottom-4 border-bottom border-danger border-3">
        <div className="container-fluid" style={{ background: "None"}}>
          <a href="/#" className="navbar-brand text-danger fw-semibold" style={{ background: "None"}}>Watchlist</a>
          <div className="collapse navbar-collapse" style={{ background: "None"}}>
            <div className="navbar-nav" style={{ background: "None"}}>
              <Link to="/favoritos" className="nav-link text-danger fw-medium">Favoritos</Link>
            </div>
          </div>
          <form className="d-flex" style={{ background: "None"}}>
          </form>
        </div>
      </nav>
      <div className="container col-9 mx-auto mt-5">
      <div className="row row-cols-1 row-cols-md-4 g-2 justify-content-center" style={{ height: "60rem" }}>
        {favoritos.map(filme => (
        <div className="col" key={filme.imdbID} onClick={() => navigate(`filme/${filme.imdbID}`)} style={{ cursor: "pointer" }}>
          <div className="card h-25 border-0" style={{ backgroundColor: "#000000"}}>
            <img src={filme.Poster} className="card-img-top img-fluid" alt={filme.Title}/>
            <div className="card-body">
              <h5 className="card-title fw-bold text-uppercase">{filme.Title}</h5>
            <div className="bottom-100">
              <p className="card-text p-0" style={{ backgroundColor: "rgb(20, 20, 20)"}}>{filme.Year} - {filme.Type === "movie" ? "Filme" : "Serie"}</p>
            </div>
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
    </div>
  )
}




function App() {
  return (
    <FavoritosProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <RotaProtegida>
              <Home />
            </RotaProtegida>} />
          <Route path="/filme/:id" element={<Detalhes />} />
          <Route path="/favoritos" element={
            <RotaProtegida>
              <Favoritos />
            </RotaProtegida>
            } />
        </Routes>
      </BrowserRouter>
    </FavoritosProvider>
  )
}

export default App
