import { useState } from "react"
import { eliminarMovimiento } from "../Servicios/movimientos"

function ConfirmarEliminacion({ movimiento, alConfirmar }) {
  const [eliminando, setEliminando] = useState(false)

  const claseBotonBase =
    "w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors sm:w-auto"

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2 text-sm text-ink/70">
        <p>
          ¿Seguro que querés eliminar{" "}
          <strong className="text-ink">"{movimiento.descripcion}"</strong>?
        </p>
        <p className="text-ink/50">
          {movimiento.tipo} de {movimiento.monto.toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })} · {movimiento.fecha}
        </p>
        <p>Esta acción no se puede deshacer.</p>
      </div>

      {/* flex-col en mobile (Cancelar arriba, rojo abajo), fila en desktop */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          autoFocus
          onClick={alConfirmar}
          className={`${claseBotonBase} border border-ink/15 bg-white text-ink/70 shadow-sm hover:bg-ink/5`}
        >
          Cancelar
        </button>

        <button
          type="button"
          disabled={eliminando}
          onClick={async () => {
            setEliminando(true)
            await eliminarMovimiento(movimiento.id)
            alConfirmar()
          }}
          className={`${claseBotonBase} bg-red-600 text-white shadow-sm hover:bg-red-700 disabled:opacity-60`}
        >
          {eliminando ? "Eliminando..." : "Eliminar"}
        </button>
      </div>
    </div>
  )
}

export default ConfirmarEliminacion