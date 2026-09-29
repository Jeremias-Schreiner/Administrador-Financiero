import { TIPOS_MOVIMIENTO } from "../Constantes/estilos"
import { useState } from "react"

import { crearMovimiento } from "../Servicios/movimientos"

function FormularioMovimiento({ etiquetas, alGuardar }) {
    const hoy = new Date()
    // que quilombo la fehca en js, quien fue el criminal que se le ocurrio que el primer
    // mes sea 0???? ENERO = 0??????????
    const fechaHoy = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`

    const [movimientoNuevo, setMovimientoNuevo] = useState({
        tipo: "",
        monto: "",
        descripcion: "",
        fecha: fechaHoy,
        etiquetaId: ""
    })

    const claseCampo =
        "w-full rounded-lg border border-ink/15 bg-white px-3 py-1 text-sm text-ink shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
    const claseLabel = "mb-1 block text-sm font-medium text-ink/70"

    return (
        <form className="flex flex-col gap-4"
            onSubmit={async (event) => {
                event.preventDefault()
                try {
                    await crearMovimiento({
                        ...movimientoNuevo,
                        monto: Number(movimientoNuevo.monto),
                        etiquetaId: Number(movimientoNuevo.etiquetaId)
                    })
                    alGuardar()
                } catch (error) {
                    console.error(error) // por ahora, más adelante mostramos algo en el form
                }
            }}>
            <div>
                <label htmlFor="TipoMovimiento" className={claseLabel}>Tipo Movimiento</label>
                <select id="TipoMovimiento" name="TipoMovimiento"
                    className={claseCampo}
                    value={movimientoNuevo.tipo}
                    onChange={(event) => {
                        setMovimientoNuevo((MovimientoActual) => ({ ...MovimientoActual, tipo: event.target.value }))
                    }} required>
                    <option key={0} value="" disabled>--Elegí un tipo--</option>
                    {Object.keys(TIPOS_MOVIMIENTO).map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
                </select>
            </div>

            <div>
                <label htmlFor="Monto" className={claseLabel}>Monto</label>
                <input type="number" id="Monto" name="Monto" required
                    className={claseCampo}
                    value={movimientoNuevo.monto}
                    onChange={(event) => {
                        const valor = event.target.value
                        setMovimientoNuevo((MovimientoActual) => ({
                            ...MovimientoActual,
                            monto: valor === "" ? "" : Number(valor)
                        }))
                    }} />
            </div>

            <div>
                <label htmlFor="Descripcion" className={claseLabel}>Descripción</label>
                <input id="Descripcion" placeholder="Motivo del movimiento" name="Descripcion" required
                    className={claseCampo}
                    value={movimientoNuevo.descripcion}
                    onChange={(event) => {
                        setMovimientoNuevo((MovimientoActual) => ({ ...MovimientoActual, descripcion: event.target.value }))
                    }} />
            </div>

            <div>
                <label htmlFor="Fecha" className={claseLabel}>Fecha del Movimiento</label>
                <input type="date" id="Fecha" name="Fecha"
                    className={claseCampo}
                    value={movimientoNuevo.fecha}
                    onChange={(event) => {
                        setMovimientoNuevo((MovimientoActual) => ({ ...MovimientoActual, fecha: event.target.value }))
                    }} />
            </div>

            <div>
                <label htmlFor="NombreEtiqueta" className={claseLabel}>Etiqueta</label>
                <select id="NombreEtiqueta" name="NombreEtiqueta" className={claseCampo} required
                    value={movimientoNuevo.etiquetaId}
                    onChange={(event) => {
                        setMovimientoNuevo((MovimientoActual) => ({ ...MovimientoActual, etiquetaId: event.target.value }))
                    }}>
                    <option key={0} value="" disabled>--Seleccione una etiqueta--</option>
                    {etiquetas.map(etiqueta => <option key={etiqueta.id} value={etiqueta.id}>{etiqueta.nombre}</option>)}
                </select>
            </div>

            <div className="flex justify-end pt-2">
                <button type="submit"
                    className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                    Crear
                </button>
            </div>
        </form>
    )
}

export default FormularioMovimiento