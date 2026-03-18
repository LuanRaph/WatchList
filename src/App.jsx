import { useState, useEffect, createContext, useContext } from "react"
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link } from "react-router-dom"

const API_KEY = "332d9c67"

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
          <Route path="/" element={<Home />} />
          <Route path="/filme/:id" element={<Detalhes />} />
          <Route path="/favoritos" element={<Favoritos />} />
        </Routes>
      </BrowserRouter>
    </FavoritosProvider>
  )
}

export default App
