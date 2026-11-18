function FilaEtiqueta({ etiqueta }) {
    const clasesEstado = etiqueta.activa
        ? 'bg-green-100 text-green-700'
        : 'bg-red-100 text-black/60'

    return (
        <li className="border-b border-ink/10">
            <div className="flex items-center gap-3 px-4 py-4 sm:px-6">
                <span
                    className={`h-3 w-3 shrink-0 rounded-full ring-1 ring-ink/10 ${etiqueta.color}`}
                    aria-hidden="true"
                />

                <span
                    className="min-w-0 flex-1 truncate text-base font-medium lg:text-sm"
                    title={etiqueta.nombre}
                >
                    {etiqueta.nombre}
                </span>

                <span className={` ${clasesEstado} shrink-0 rounded-lg px-5 py-2 text-xs font-medium`}>
                    {etiqueta.activa ? 'Activa' : 'Desuso'}
                </span>
            </div>
        </li>
    )
}

export default FilaEtiqueta