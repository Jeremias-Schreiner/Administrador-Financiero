import { useEffect, useState } from 'react'

// de momento este import no es necesario pero lo dejo para futuro
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

import Layout from './Estructuras/Layout'
import BarraAcciones from './Estructuras/BarraAcciones'

import Movimiento from './Componentes/Movimiento'

import { obtenerMovimientos } from './Servicios/movimientos'
import { obtenerEtiquetas } from './Servicios/etiquetas'

const TITULO = "Administrador Financiero"

function App() {

  const [pagina, setPagina] = useState(1)
  const [paginasData, setPaginasData] = useState(null)
  const [cargado, setCargado] = useState(true) // empieza en cargado porque la pag reenderiza, esta logica es para cuando esta cargando una pag nueva
  const [error, setError] = useState(null)
  const [etiquetas, setEtiquetas] = useState([])

  useEffect(() => {
    let cancelado = false

    async function cargarEtiquetas() {
      try {
        const etique = await obtenerEtiquetas()
        if (!cancelado)
          setEtiquetas(etique)
      }
      catch (error) {
        if (!cancelado) setError(error)
      }
    }
    cargarEtiquetas()
    return ()=>{ cancelado = true }
  }, [])

  useEffect(() => {
    let cancelado = false
    async function cargarPaginas() {
      try {
        setCargado(true)
        const mov = await obtenerMovimientos({ pagina })

        if (cancelado) return //al ser asincrona la func, si el usario mientras se procesa esta trx cambia de pagina, se dispara la func de nuevo pero con cancelado en true por lo que se descarta la primer respuesta y aplica la segunda actualizando con la pag nueva

        if (mov.paginasCant === 0) {
          if (pagina !== 1) {
            setPagina(1); return
          }
        }
        else if (pagina > mov.paginasCant) {
          setPagina(mov.paginasCant); return
        }

        setPaginasData(mov)
        setError(null)
      }
      catch (error) {
        if (!cancelado) setError(error)
      }
      finally {
        if (!cancelado) setCargado(false)
      }
    }
    cargarPaginas()

    return () => { cancelado = true }
  }, [pagina])


  if (error) {
    return (
      <Layout titulo={TITULO}>
        <h1>error</h1>
      </Layout>
    )
  }

  if (paginasData === null) {
    return <Layout titulo={TITULO}></Layout>
  }

  const { movimientos, paginasCant } = paginasData

  // estado vacío: cargó bien pero no hay nada
  if (paginasCant === 0) {
    return (
      <Layout titulo={TITULO}>
        <p>Todavía no hay movimientos. Apretá el botón + para cargar el primero.</p>
          <BarraAcciones
            pagina={pagina}
            paginasCant={0}
            setPagina={setPagina}
          />
      </Layout>
    )
  }


  // el uso del map vuelve esto mas rapido, deja de ser un O(nxm)
  const etiquetasMap = new Map(etiquetas.map((etique) => { return [etique.id, etique] }))
  return (
    <Layout titulo={TITULO}>
      <ul className={cargado ? 'opacity-50' : ''}>
        {movimientos.map((movimiento) => {
          const etiqueta = etiquetasMap.get(movimiento.etiquetaId)
          return (
            <Movimiento key={movimiento.id} movimiento={movimiento} etiqueta={etiqueta} />
          )
        })}
      </ul>
      <BarraAcciones
        pagina={pagina}
        paginasCant={paginasCant}
        setPagina={setPagina}
      />
    </Layout>
  )
}

export default App