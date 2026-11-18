import { useState } from "react"

import FilaEtiqueta from "../Componentes/FilaEtiquetas"
import FormularioEtiqueta from "../Componentes/FormularioEtiquetas"
import Modal from "../Estructuras/Modal"
import BarraAcciones from "../Estructuras/BarraAcciones"

function Etiquetas({ etiquetas, alCambiarEtiquetas }) {
  const POR_PAGINA = 5
  const [pagina, setPagina] = useState(1)
  const [modalActivo, setModalActivo] = useState(false)

  const paginasCant = Math.ceil(etiquetas.length / POR_PAGINA)
  const paginaActual = Math.min(pagina, paginasCant)
  const inicio = (paginaActual - 1) * POR_PAGINA
  const etiquetasPagina = etiquetas.slice(inicio, inicio + POR_PAGINA)
  const activas = etiquetas.filter((etiqueta) => etiqueta.activa).length

  if (etiquetas.length === 0) {
    return <p>Todavía no hay etiquetas cargadas.</p>
  }

  async function manejarGuardado() {
    setModalActivo(false)
    const cantidadNueva = etiquetas.length + 1
    await alCambiarEtiquetas()
    setPagina(Math.ceil(cantidadNueva / POR_PAGINA))
  }

    return (
    <>
      {etiquetas.length === 0 ? (
        <p className="text-sm text-ink/60">
          Todavía no hay etiquetas. Usá el botón + para crear la primera.
        </p>
      ) : (
        <ul>
          {etiquetasPagina.map((etiqueta) => (
            <FilaEtiqueta key={etiqueta.id} etiqueta={etiqueta} />
          ))}
        </ul>
      )}

      {etiquetas.length > 0 && (
        <p className="mt-4 text-xs text-ink/50">
          {etiquetas.length} etiquetas · {activas} activas
        </p>
      )}

      <Modal
        titulo="Crear Etiqueta"
        abierto={modalActivo}
        alCerrar={() => setModalActivo(false)}
      >
        <FormularioEtiqueta alGuardar={manejarGuardado} />
      </Modal>

      <BarraAcciones
        pagina={paginaActual}
        paginasCant={paginasCant}
        setPagina={setPagina}
        alAgregar={() => setModalActivo(true)}
        ariaLabelAgregar="Agregar etiqueta"
      />
    </>
  )
}

export default Etiquetas