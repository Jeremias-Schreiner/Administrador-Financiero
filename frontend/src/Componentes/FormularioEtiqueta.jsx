import { useState } from "react";

import Etiqueta from "./Etiqueta";
import { COLORES_ETIQUETAS } from "../Constantes/estilos";
import { crearEtiqueta } from "../Servicios/etiquetas";

const OPCIONES_COLOR = Object.entries(COLORES_ETIQUETAS).map(([clave, clase]) => ({
    clase,
    nombre: clave.charAt(0) + clave.slice(1).toLowerCase(),
}))

function FormularioEtiqueta({ alGuardar }) {

    const [nombre, setNombre] = useState("")
    const [color, setColor] = useState(COLORES_ETIQUETAS.AZUL) // color por defecto
    const [enviando, setEnviando] = useState(false)
    const [error, setError] = useState(null)

    const claseInput = "w-full rounded-lg border border-ink/15 bg-white px-3 py-1 text-sm text-ink shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30"
    const claseLabel = "mb-1 block text-sm font-medium text-ink/70"

    async function manejarEnvio(evento) {
        evento.preventDefault()
        if (enviando) return //evitar que se creen multiples etiquetas al hacer click multiples veces en crear

        const nombreLimpio = nombre.trim()
        if (!nombreLimpio) {
            setError("El nombre no puede estar vacio")
            return //no se logra enviar
        }

        try {
            setEnviando(true)
            setError(null)//por si quedo un error de antes
            await crearEtiqueta({ nombre: nombreLimpio, color })
            await alGuardar()
        }
        catch (e) {
            setError("No se pudo crear la etiqueta")
        }
        finally {
            setEnviando(false)
        }
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={manejarEnvio}>
            <div>
                <label htmlFor="NombreEtiquetaNueva" className={claseLabel}>
                    Nombre
                </label>
                <input
                    id="NombreEtiquetaNueva"
                    name="NombreEtiquetaNueva"
                    type="text"
                    required
                    maxLength={30}
                    placeholder="Ej: Salidas, Mascota, Impuestos"
                    className={claseInput}
                    value={nombre}
                    onChange={(evento) => setNombre(evento.target.value)}
                />
            </div>

            <div>
                <label htmlFor="ColorEtiqueta" className={claseLabel}>
                    Color
                </label>
                <select
                    id="ColorEtiqueta"
                    name="ColorEtiqueta"
                    className={claseInput} //El select es un tipo de input por eso el nombre de la variable
                    value={color}
                    onChange={(evento) => setColor(evento.target.value)}
                >
                    {
                        OPCIONES_COLOR.map((opcion) => {
                            return (
                                //uso nombre como key pero podria usar los indices supongo tamb
                                <option key={opcion.nombre} value={opcion.clase}>
                                    {opcion.nombre}
                                </option>
                            )
                        })
                    }
                </select>
            </div>

            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={enviando}
                    className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 active:scale-95 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    {enviando ? "Creando..." : "Crear"}
                </button>
            </div>

        </form>
    )
}

export default FormularioEtiqueta