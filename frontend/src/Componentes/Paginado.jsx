function Paginado({ pagina, paginasCant, setPagina }) {
  // no hay nada que paginar con 0 o 1 página
  if (paginasCant <= 1) return null

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => setPagina((p) => p - 1)}
        disabled={pagina === 1}
        aria-label="Página anterior"
        className="rounded bg-white px-3 py-1 text-blue-600 shadow disabled:opacity-40"
      >
        ‹
      </button>

      {/* en celular: solo pagina/total, en desktop (>=640px): los numeros */}
      <span className="sm:hidden tabular-nums text-blue-600">
        {pagina}/{paginasCant}
      </span>

      <div className="hidden items-center gap-2 sm:flex">
        {Array.from({ length: paginasCant }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setPagina(n)}
            aria-current={pagina === n ? 'page' : undefined}
            className={`rounded px-3 py-1 shadow ${
              pagina === n
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600'
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setPagina((p) => p + 1)}
        disabled={pagina === paginasCant}
        aria-label="Página siguiente"
        className="rounded bg-white px-3 py-1 text-blue-600 shadow disabled:opacity-40"
      >
        ›
      </button>
    </div>
  )
}

export default Paginado