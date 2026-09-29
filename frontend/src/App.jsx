import { useEffect, useState } from 'react'

// de momento este import no es necesario pero lo dejo para futuro
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'


import Layout from './Estructuras/Layout'
import BarraAcciones from './Estructuras/BarraAcciones'
import Modal from './Estructuras/Modal'

import Movimiento from './Componentes/Movimiento'
import FormularioMovimiento from './Componentes/FormularioMovimiento'

import { obtenerMovimientos } from './Servicios/movimientos'
import { obtenerEtiquetas } from './Servicios/etiquetas'


const TITULO = "Administrador Financiero"

function App() {

  const [pagina, setPagina] = useState(1)
  const [paginasData, setPaginasData] = useState(null)
  const [cargado, setCargado] = useState(true) // empieza en cargado porque la pag reenderiza, esta logica es para cuando esta cargando una pag nueva
  const [error, setError] = useState(null)
  const [etiquetas, setEtiquetas] = useState([])
  const [modalActivo, setModalActivo] = useState(false)

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
    return () => { cancelado = true }
  }, [])

  async function manejarMovimientoCreado() {
    setModalActivo(false)
    if (pagina === 1) {
      await cargarPaginas(() => false)   // ya estás en 1, nadie va a recargarte solo, hacelo vos
    } else {
      setPagina(1)                       // esto sí dispara el useEffect solo
    }
  }

  async function cargarPaginas(chequearCancelado) {
    try {
      setCargado(true)
      const mov = await obtenerMovimientos({ pagina })

      if (chequearCancelado()) return

      if (mov.paginasCant === 0) {
        if (pagina !== 1) { setPagina(1); return }
      }
      else if (pagina > mov.paginasCant) {
        setPagina(mov.paginasCant); return
      }

      setPaginasData(mov)
      setError(null)
    }
    catch (error) {
      if (!chequearCancelado()) setError(error)
    }
    finally {
      if (!chequearCancelado()) setCargado(false)
    }
  }


  useEffect(() => {
    let cancelado = false
    cargarPaginas(() => cancelado)
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
        <Modal abierto={modalActivo} alCerrar={() => setModalActivo(false)}>
          <FormularioMovimiento etiquetas={etiquetas} alGuardar={manejarMovimientoCreado} />
        </Modal>
        <BarraAcciones
          pagina={pagina}
          paginasCant={0}
          setPagina={setPagina}
          alAgregar={() => setModalActivo(true)}
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
      <Modal
        abierto={modalActivo}
        alCerrar={() => { setModalActivo(false) }}
      >
        <FormularioMovimiento
          etiquetas={etiquetas}
          alGuardar={manejarMovimientoCreado}
        />
      </Modal>
      <BarraAcciones
        pagina={pagina}
        paginasCant={paginasCant}
        setPagina={setPagina}
        alAgregar={() => {
          setModalActivo(true)
        }}
      />
    </Layout>
  )
}

export default App