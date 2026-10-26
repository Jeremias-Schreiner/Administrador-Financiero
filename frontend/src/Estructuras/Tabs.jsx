function Tabs({ items, activa, alCambiar }) {
  return (
    <nav
      role="tablist"
      aria-label="Secciones del administrador"
      className="mb-4 flex gap-1 overflow-x-auto border-b border-ink/10"
    >
      {items.map((item) => {
        const seleccionada = item.id === activa

        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={seleccionada}
            onClick={() => alCambiar(item.id)}
            className={`shrink-0 border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              seleccionada
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-ink/60 hover:text-ink'
            }`}
          >
            {item.texto}
          </button>
        )
      })}
    </nav>
  )
}

export default Tabs