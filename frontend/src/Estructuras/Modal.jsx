function Modal({ abierto, alCerrar, titulo, children }) {
    if (!abierto) return null
    return (
        <div
            className="fixed inset-0 z-50 bg-ink/50 lg:flex lg:items-center lg:justify-center lg:p-6"
            onClick={alCerrar}
        >
            {/* panel: pantalla completa por defecto, caja centrada desde lg */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label={titulo}
                onClick={(e) => e.stopPropagation()}
                className="h-full w-full overflow-y-auto bg-paper lg:h-auto lg:max-h-[90vh] lg:max-w-lg lg:rounded-2xl lg:shadow-xl"
            >
                <header className="sticky top-0 flex items-center gap-3 border-b border-ink/10 bg-paper px-4 py-3">
                    <button
                        type="button"
                        onClick={alCerrar}
                        aria-label="Cerrar"
                        className="rounded p-1 text-ink/60 transition hover:bg-ink/5 hover:text-ink"
                    >
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                        </svg>
                    </button>
                    <h2 className="text-lg font-semibold text-zinc-600">{titulo}</h2>
                </header>

                <div className="px-4 py-4">{children}</div>
            </div>
        </div>
    )
}

export default Modal