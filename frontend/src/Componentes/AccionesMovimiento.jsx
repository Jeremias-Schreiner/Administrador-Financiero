function AccionesMovimiento({ movimiento, alEditar, alEliminar }) {
  const claseBoton =
    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink/15 " +
    "bg-white text-ink/60 shadow-sm transition-colors " +
    "hover:border-blue-600 hover:text-blue-600"

  return (

    <div className="flex shrink-0 items-center gap-2" onClick={(evento) => evento.stopPropagation()}>
      <button
        type="button"
        title="Editar"
        aria-label={`Editar movimiento ${movimiento.descripcion}`}
        className={claseBoton}
        onClick={() => alEditar?.(movimiento)}
      >
        {/* boton editar */}
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <button
        type="button"
        title="Eliminar"
        aria-label={`Eliminar movimiento ${movimiento.descripcion}`}
        className={`${claseBoton} hover:border-red-600 hover:text-red-600`}
        onClick={() => alEliminar?.(movimiento)}
      >
        {/* boton tacho */}
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

export default AccionesMovimiento