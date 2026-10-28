import FilaEtiqueta from "../Componentes/FilaEtiquetas"
import { useState } from "react"
import BarraAcciones from "../Estructuras/BarraAcciones"

function Etiquetas({ etiquetas }) {
  const POR_PAGINA = 5
  const [pagina, setPagina] = useState(1)

  const paginasCant = Math.ceil(etiquetas.length / POR_PAGINA)
  const paginaActual = Math.min(pagina, Math.max(1, paginasCant))
  const inicio = (paginaActual - 1) * POR_PAGINA
  const etiquetasPagina = etiquetas.slice(inicio, inicio + POR_PAGINA)

  if (etiquetas.length === 0) {
    return <p>Todavía no hay etiquetas cargadas.</p>
  }

  return (
    <div>
      <ul>
        {etiquetasPagina.map((etiqueta) => (
          <FilaEtiqueta key={etiqueta.id} etiqueta={etiqueta} />
        ))}
      </ul>
      <BarraAcciones
        pagina={pagina}
        paginasCant={paginasCant}
        setPagina={setPagina}
        alAgregar={()=>{alert("Pa crear etiquetas")}} //abrirCreacion
      />
    </div>
  )
}

export default Etiquetas