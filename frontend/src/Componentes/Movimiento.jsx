import { useState } from 'react'
import Etiqueta from './Etiqueta'
import { formatearFecha } from '../Utils/fechas'
import { TIPOS_MOVIMIENTO } from '../Constantes/estilos'

function Movimiento({ movimiento, etiqueta }) {
  const [expandido, setExpandido] = useState(false)

  const estilo = TIPOS_MOVIMIENTO[movimiento.tipo] ?? { signo: '', claseTexto: 'text-ink' }
  const montoFormateado = movimiento.monto.toLocaleString('es-AR', {
    style: 'currency',
    currency: 'ARS',
  })

  return (
    <li className="border-b border-ink/10 px-6 py-2">
      {/* --- Version desktop: fila completa, siempre visible a partir de "lg" --- */}
      <div className="hidden lg:flex items-center gap-3 py-3  hover:bg-ink/5 transition-colors">
        <span className="w-20 shrink-0 text-xs text-ink/50 tabular-nums">
          {formatearFecha(movimiento.fecha)}
        </span>

        {etiqueta && <Etiqueta nombre={etiqueta.nombre} color={etiqueta.color} />}

        <span className="flex-1 truncate text-sm ">{movimiento.descripcion}</span>

        <span className={`text-sm font-medium tabular-nums ${estilo.claseTexto}`}>
          {estilo.signo !== "" ? estilo.signo + " ": estilo.signo}
          {montoFormateado}
        </span>
      </div>
      {/* --- Fin de version Desktop */}

      {/* --- Version mobile/tablet: acordeon, solo por debajo de "lg" --- */}
      <div className="lg:hidden text">
        <button
          type="button"
          onClick={() => setExpandido((valorActual) => !valorActual)}
          aria-expanded={expandido}
          className="w-full flex items-center justify-between gap-3 py-3 text-left"
        >
          <span className={`flex-1 truncate text-2xl font-medium ${estilo.claseTexto}`}>
            {movimiento.descripcion}
          </span>
          <svg
            className={`h-4 w-4 shrink-0 text-ink/40 transition-transform ${
              expandido ? 'rotate-180' : ''
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {expandido && (
          <div className="pb-3 pl-1 space-y-1 text-2xl text-ink/70">
            <div>Fecha: {formatearFecha(movimiento.fecha)}</div>
            <div>Tipo: {movimiento.tipo}</div>
            {etiqueta && (
              <div className="flex items-center gap-2">
                Etiqueta: <Etiqueta nombre={etiqueta.nombre} color={etiqueta.color} />
              </div>
            )}
            <div className={`font-medium ${estilo.claseTexto}`}>
              {estilo.signo !== "" ? estilo.signo + " ": estilo.signo}
              {montoFormateado}
            </div>
          </div>
        )}
      </div>
      {/* --- Fin de version mobile */}
    </li>
  )
}

export default Movimiento