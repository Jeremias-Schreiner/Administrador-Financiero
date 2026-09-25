import BotonAgregar from '../Componentes/BotonAgregar'
import Paginado from '../Componentes/Paginado'

function BarraAcciones({ pagina, paginasCant, setPagina, alAgregar }) {
  return (
    <footer className="mt-6 grid grid-cols-3 items-center">
      <div />
      <div className="justify-self-center">
        <BotonAgregar alPresionar={alAgregar} />
      </div>
      <div className="justify-self-end">
        <Paginado
          pagina={pagina}
          paginasCant={paginasCant}
          setPagina={setPagina}
        />
      </div>
    </footer>
  )
}

export default BarraAcciones