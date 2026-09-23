  import { useEffect, useState } from 'react'

  // de momento este import no es necesario pero lo dejo para futuro
  import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

  import Movimiento from './Componentes/Movimiento'
  import Layout from './Estructuras/Layout'

  import { obtenerMovimientos } from './Servicios/movimientos'
  import { obtenerEtiquetas } from './Servicios/etiquetas'

  const TITULO = "Administrador Financiero"

  function App() {

    const [etiquetas, setEtiquetas] = useState([])
    const [movimientos, setMovimientos] = useState([])
    const [cargado, setCargado] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
      async function cargarMovimientos() {
        try{
          const [mov, etique] = await Promise.all([
            obtenerMovimientos(),
            obtenerEtiquetas()
          ])
          setMovimientos(mov)
          setEtiquetas(etique)
          setCargado(true)
        }
        catch(error){
          setError(error)
        }
      }
      cargarMovimientos()
    }, [])

    
    if (error) {
      return (
        <Layout titulo={TITULO}>
          <h1>error</h1>
        </Layout>
      )
    }
    if (!cargado){
      return (
        <Layout titulo={TITULO}>
          <h1>cargando...</h1>
        </Layout>
      )
    }
    return (
      <Layout titulo={TITULO}>
        <ul>
          {movimientos.map((movimiento) => {
            const etiqueta = etiquetas.find((e) => e.id === movimiento.etiquetaId)
            return (
              <Movimiento key={movimiento.id} movimiento={movimiento} etiqueta={etiqueta} />
            )
          })}
        </ul>
      </Layout>
    )
  }

  export default App