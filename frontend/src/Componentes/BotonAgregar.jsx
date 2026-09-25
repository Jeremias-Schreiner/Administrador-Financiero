function BotonAgregar({ alPresionar }) {
  return (
    <button
      type="button"
      onClick={alPresionar}
      aria-label="Agregar movimiento"
      className="rounded-2xl bg-blue-600 px-6 py-3 text-2xl font-bold leading-none text-white shadow-lg transition hover:bg-blue-700 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      +
    </button>
  )
}

export default BotonAgregar