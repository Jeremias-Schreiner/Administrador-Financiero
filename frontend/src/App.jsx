import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const filasIniciales = [
  { id: 1, nombre: 'fila uno', valor: 10 },
  { id: 2, nombre: 'fila dos', valor: 25 },
]

function App() {
  const [contador, setContador] = useState(0)
  const [filas, setFilas] = useState(filasIniciales)

  const actualizarCelda = (id, campo, valor) => {
    setFilas((prev) =>
      prev.map((fila) => (fila.id === id ? { ...fila, [campo]: valor } : fila)),
    )
  }

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* 1. React puro: estado + evento */}
      <section>
        <h2>1. React (useState)</h2>
        <button onClick={() => setContador(contador + 1)}>
          Clickeado {contador} veces
        </button>
      </section>

      {/* 2. Tailwind: si esto sale con fondo verde y texto blanco, Tailwind está aplicando */}
      <section>
        <h2>2. Tailwind</h2>
        <div className="bg-moss text-white p-4 rounded-lg">
          Si ves esto con fondo verde oscuro y bordes redondeados, Tailwind funciona.
        </div>
      </section>

      {/* 3. Tabla HTML editable, sin librería externa */}
      <section>
        <h2>3. Tabla editable (HTML + Tailwind)</h2>
        <table className="border-collapse border border-ink/20">
          <thead>
            <tr>
              <th className="border border-ink/20 px-3 py-1 text-left">Nombre</th>
              <th className="border border-ink/20 px-3 py-1 text-left">Valor</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((fila) => (
              <tr key={fila.id}>
                <td className="border border-ink/20 p-0">
                  <input
                    className="w-full px-3 py-1 outline-none focus:bg-paper"
                    value={fila.nombre}
                    onChange={(e) => actualizarCelda(fila.id, 'nombre', e.target.value)}
                  />
                </td>
                <td className="border border-ink/20 p-0">
                  <input
                    type="number"
                    className="w-full px-3 py-1 outline-none focus:bg-paper"
                    value={fila.valor}
                    onChange={(e) =>
                      actualizarCelda(fila.id, 'valor', Number(e.target.value))
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 4. Recharts: gráfico sincronizado con la tabla de arriba */}
      <section>
        <h2>4. Recharts (sincronizado con la tabla)</h2>
        <div style={{ width: '100%', height: 200 }}>
          <ResponsiveContainer>
            <LineChart data={filas}>
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="valor" stroke="#3A5A40" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}

export default App