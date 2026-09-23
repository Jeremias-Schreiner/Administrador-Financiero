function Etiqueta({ nombre, color }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-sm font-medium text-white ${color}`}>
      {nombre}
    </span>
  )
}

export default Etiqueta