import { useEffect, useState } from 'react'

// de momento este import no es necesario pero lo dejo para futuro
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

import Movimiento from './Componentes/Movimiento'

import { obtenerMovimientos } from './Servicios/movimientos'
import { obtenerEtiquetas } from './Servicios/etiquetas'


function App() {

  const [etiquetas, setEtiquetas] = useState([])
  const [movimientos, setMovimientos] = useState([])
  const [cargado, setCargado] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function cargarMovimientos() {

      const [mov, etique] = await Promise.all([
        obtenerMovimientos(),
        obtenerEtiquetas()
      ])
      setMovimientos(mov)
      setEtiquetas(etique)
    }
    cargarMovimientos()
  }, [])

  return (
    <>
      <ul>
        {movimientos.map((movimiento) => {
          const etiqueta = etiquetas.find((e) => e.id === movimiento.etiquetaId)
          return (
            <Movimiento
              key={movimiento.id}
              movimiento={movimiento}
              etiqueta={etiqueta}
            />
          )
        })}
      </ul>
    </>
  )
}

export default App