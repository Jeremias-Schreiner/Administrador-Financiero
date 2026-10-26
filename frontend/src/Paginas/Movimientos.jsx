import { useEffect, useState } from 'react'

import BarraAcciones from '../Estructuras/BarraAcciones'
import Modal from '../Estructuras/Modal'

import Movimiento from '../Componentes/Movimiento'
import FormularioMovimiento from '../Componentes/FormularioMovimiento'
import ConfirmarEliminacion from '../Componentes/ConfirmarEliminacion'

import { obtenerMovimientos } from '../Servicios/movimientos'

function Movimientos({ etiquetas, etiquetasActivas }) {
  const [pagina, setPagina] = useState(1)
  const [paginasData, setPaginasData] = useState(null)
  const [cargado, setCargado] = useState(true)
  const [error, setError] = useState(null)
  const [modalActivo, setModalActivo] = useState(false)
  const [movimientoEditando, setMovimientoEditando] = useState(null)
  const [movimientoEliminando, setMovimientoEliminando] = useState(null)

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

  async function recargarLista() {
    if (pagina === 1) {
      await cargarPaginas(() => false)
    } else {
      setPagina(1)
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
      } else if (pagina > mov.paginasCant) {
        setPagina(mov.paginasCant); return
      }

      setPaginasData(mov)
      setError(null)
    } catch (e) {
      if (!chequearCancelado()) setError(e)
    } finally {
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
      <p className="text-sm text-red-600">
        No se pudieron cargar los movimientos.
      </p>
    )
  }

  if (paginasData === null) {
    return <p className="text-sm text-ink/60">Cargando movimientos...</p>
  }

  const { movimientos, paginasCant } = paginasData
  const etiquetasMap = new Map(
    etiquetas.map((etique) => [etique.id, etique])
  )

  return (
    <>
      {paginasCant === 0 ? (
        <p>Todavía no hay movimientos. Apretá el botón + para cargar el primero.</p>
      ) : (
        <ul className={cargado ? 'opacity-50' : ''}>
          {movimientos.map((movimiento) => {
            const etiqueta = etiquetasMap.get(movimiento.etiquetaId)
            return (
              <Movimiento
                key={movimiento.id}
                movimiento={movimiento}
                etiqueta={etiqueta}
                alEditar={abrirEdicion}
                alEliminar={abrirEliminacion}
              />
            )
          })}
        </ul>
      )}

      <Modal
        titulo={
          movimientoEliminando ? 'Eliminar Movimiento'
            : movimientoEditando ? 'Editar Movimiento'
              : 'Crear Movimiento'
        }
        abierto={modalActivo}
        alCerrar={cerrarModal}
      >
        {movimientoEliminando ? (
          <ConfirmarEliminacion
            movimiento={movimientoEliminando}
            alConfirmar={manejarEliminacion}
          />
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
    </>
  )
}

export default Movimientos