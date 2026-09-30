import { useEffect, useState } from 'react'

// de momento este import no es necesario pero lo dejo para futuro
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'


import Layout from './Estructuras/Layout'
import BarraAcciones from './Estructuras/BarraAcciones'
import Modal from './Estructuras/Modal'

import Movimiento from './Componentes/Movimiento'
import FormularioMovimiento from './Componentes/FormularioMovimiento'
import ConfirmarEliminacion from './Componentes/ConfirmarEliminacion'

import { obtenerMovimientos } from './Servicios/movimientos'
import { obtenerEtiquetas, obtenerEtiquetasActivas } from './Servicios/etiquetas'


const TITULO = "Administrador Financiero"

function App() {

  const [pagina, setPagina] = useState(1)
  const [paginasData, setPaginasData] = useState(null)
  const [cargado, setCargado] = useState(true) // empieza en cargado porque la pag reenderiza, esta logica es para cuando esta cargando una pag nueva
  const [error, setError] = useState(null)
  const [etiquetas, setEtiquetas] = useState([])
  const [etiquetasActivas, setEtiquetasActivas] = useState([])
  const [modalActivo, setModalActivo] = useState(false)
  const [movimientoEditando, setMovimientoEditando] = useState(null) //null porque no hay movimientos editandose por defecto
  const [movimientoEliminando, setMovimientoEliminando] = useState(null)// idem al anterior

  function abrirCreacion() {
    setMovimientoEditando(null)
    setMovimientoEliminando(null)
    setModalActivo(true)
  }

  function abrirEdicion(mov) {
    setMovimientoEditando(mov)
    setMovimientoEliminando(null)
    setModalActivo(true)
  }

  function abrirEliminacion(mov) {
    setMovimientoEditando(null)
    setMovimientoEliminando(mov)
    setModalActivo(true)
  }

  function cerrarModal() {
    setMovimientoEditando(null)
    setMovimientoEliminando(null)
    setModalActivo(false)
  }

  //modificado para ser reutilizado al editar y al crear
  async function recargarLista() {
    if (pagina === 1) {
      await cargarPaginas(() => false)   // Hago esto para que recargue la pag
    } else {
      setPagina(1)                       // esto sí dispara el useEffect solo
    }
  }

  async function manejarGuardado() {
    cerrarModal()
    await recargarLista()
  }

  async function manejarEliminacion() {
    cerrarModal()
    await recargarLista()
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

    async function cargarEtiquetasActivas() {
      try {
        const etique = await obtenerEtiquetasActivas()
        if (!cancelado)
          setEtiquetasActivas(etique)
      }
      catch (error) {
        if (!cancelado) setError(error)
      }
    }

    cargarEtiquetas()
    cargarEtiquetasActivas()
    return () => { cancelado = true }
  }, [])

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

  // el uso del map vuelve esto mas rapido, deja de ser un O(nxm)
  const etiquetasMap = new Map(etiquetas.map((etique) => { return [etique.id, etique] }))

  return (
    <Layout titulo={TITULO}>
      {paginasCant === 0 ? (
        <p>Todavía no hay movimientos. Apretá el botón + para cargar el primero.</p>
      ) : (
        <ul className={cargado ? 'opacity-50' : ''}>
          {movimientos.map((movimiento) => {
            const etiqueta = etiquetasMap.get(movimiento.etiquetaId)
            return (
              <Movimiento key={movimiento.id} movimiento={movimiento} etiqueta={etiqueta} alEditar={abrirEdicion} alEliminar={abrirEliminacion} />
            )
          })}
        </ul>
      )}

      <Modal
        titulo={
          movimientoEliminando ? "Eliminar Movimiento"
            : movimientoEditando ? "Editar Movimiento"
              : "Crear Movimiento"
        }
        abierto={modalActivo}
        alCerrar={cerrarModal}
      >
        {movimientoEliminando ? (
          <ConfirmarEliminacion
            movimiento={movimientoEliminando}
            alConfirmar={manejarEliminacion} />
        ) : (
          <FormularioMovimiento
            etiquetas={etiquetasActivas}
            movimientoEditando={movimientoEditando}
            alGuardar={manejarGuardado}
          />
        )}

      </Modal>

      <BarraAcciones
        pagina={pagina}
        paginasCant={paginasCant}
        setPagina={setPagina}
        alAgregar={abrirCreacion}
      />
    </Layout>
  )
}

export default App