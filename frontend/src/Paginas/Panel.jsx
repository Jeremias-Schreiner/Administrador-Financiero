import { useEffect, useState } from 'react'

import Layout from '../Estructuras/Layout'
import Tabs from '../Estructuras/Tabs'

import Movimientos from './Movimientos'
import Etiquetas from './Etiquetas'
import Graficos from './Graficos'

import { obtenerEtiquetas, obtenerEtiquetasActivas } from '../Servicios/etiquetas'

const TITULO = 'Administrador Financiero'

const SECCIONES = [
  { id: 'movimientos', texto: 'Menú' },
  { id: 'etiquetas', texto: 'Etiquetas' },
  { id: 'graficos', texto: 'Gráfico' },
]

function Panel() {
  const [vista, setVista] = useState('movimientos')
  const [etiquetas, setEtiquetas] = useState([])
  const [etiquetasActivas, setEtiquetasActivas] = useState([])
  const [errorEtiquetas, setErrorEtiquetas] = useState(null)

  useEffect(() => {
    let cancelado = false

    async function cargar() {
      try {
        const [todas, activas] = await Promise.all([
          obtenerEtiquetas(),
          obtenerEtiquetasActivas(),
        ])

        if (cancelado) return

        setEtiquetas(todas)
        setEtiquetasActivas(activas)
        setErrorEtiquetas(null)
      } catch (error) {
        if (!cancelado) setErrorEtiquetas(error)
      }
    }

    cargar()
    return () => { cancelado = true }
  }, [])

  // La va a usar Etiquetas después de crear/editar/desactivar
  async function recargarEtiquetas() {
    try {
      const [todas, activas] = await Promise.all([
        obtenerEtiquetas(),
        obtenerEtiquetasActivas(),
      ])

      setEtiquetas(todas)
      setEtiquetasActivas(activas)
      setErrorEtiquetas(null)
    } catch (error) {
      setErrorEtiquetas(error)
    }
  }

  return (
    <Layout titulo={TITULO}>
      <Tabs items={SECCIONES} activa={vista} alCambiar={setVista} />

      {errorEtiquetas && (
        <p className="mb-4 text-sm text-red-600">
          No se pudieron cargar las etiquetas.
        </p>
      )}

      {vista === 'movimientos' && (
        <Movimientos
          etiquetas={etiquetas}
          etiquetasActivas={etiquetasActivas}
        />
      )}

      {vista === 'etiquetas' && (
        <Etiquetas
          etiquetas={etiquetas}
          alCambiarEtiquetas={recargarEtiquetas}
        />
      )}

      {vista === 'graficos' && <Graficos etiquetas={etiquetas} />}
    </Layout>
  )
}

export default Panel