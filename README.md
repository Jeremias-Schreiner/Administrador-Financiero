# Administrador Financiero

Aplicación personal para registrar ingresos, gastos, deudas y ahorros, etiquetarlos y visualizar en qué se va la plata.

El proyecto está en desarrollo y hoy es **casi todo frontend**. La interfaz funciona con datos simulados en memoria: no hay llamadas HTTP, no hay persistencia y el backend es apenas un esqueleto con un endpoint de salud. La idea es tener primero la lógica y la UI resueltas, y reemplazar los mocks por una API real más adelante.

Este README documenta el frontend: qué hace, cómo está armado, cómo fluyen los datos y por qué se tomaron ciertas decisiones.

---

## Índice

- [Estado actual](#estado-actual)
- [Stack](#stack)
- [Cómo levantarlo](#cómo-levantarlo)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Cómo funciona: de `index.html` al componente](#cómo-funciona-de-indexhtml-al-componente)
- [Navegación sin router](#navegación-sin-router)
- [Quién es dueño del estado](#quién-es-dueño-del-estado)
- [Flujo de datos](#flujo-de-datos)
- [Modelo de datos](#modelo-de-datos)
- [La capa de servicios](#la-capa-de-servicios)
- [Paginación: dos estrategias](#paginación-dos-estrategias)
- [Diseño responsive](#diseño-responsive)
- [Estilos y convenciones visuales](#estilos-y-convenciones-visuales)
- [Estados de UI y accesibilidad](#estados-de-ui-y-accesibilidad)
- [Decisiones de diseño](#decisiones-de-diseño)
- [Problemas conocidos y deuda técnica](#problemas-conocidos-y-deuda-técnica)
- [Próximos pasos](#próximos-pasos)
- [Glosario](#glosario)

---

## Estado actual

| Sección | Estado | Detalle |
| --- | --- | --- |
| Menú (movimientos) | Funcional | Lista paginada, crear, editar y eliminar (borrado lógico) |
| Etiquetas | Lectura | Lista paginada en el cliente; el botón `+` todavía muestra un `alert` |
| Gráfico | Pendiente | Placeholder; `recharts` está instalado pero sin usar |
| Backend | Esqueleto | FastAPI con `GET /` que devuelve `{"status": "ok"}` |
| Base de datos | Sin uso | Postgres levantado por Docker, sin modelos ni migraciones |
| Autenticación | Pendiente | No existe login ni separación de usuarios |

Todo el CRUD de movimientos y la lectura de etiquetas funcionan contra **mocks en memoria** (`src/Servicios/`). Al recargar la página, los datos vuelven al estado inicial.

---

## Stack

**Frontend**

- React 18 (componentes de función, hooks, `StrictMode`)
- Vite 5 (dev server con HMR y build)
- Tailwind CSS 3 (estilos utilitarios, mobile-first)
- `recharts` 2 (instalado para el gráfico futuro)
- JavaScript con JSX, sin TypeScript

**Backend e infraestructura**

- Python 3.12 + FastAPI + Uvicorn (esqueleto)
- PostgreSQL 16
- Docker Compose (tres contenedores: `db`, `backend`, `frontend`)

No hay React Router, ni librería de estado global, ni cliente HTTP, ni tests, ni linter configurado.

---

## Cómo levantarlo

### Con Docker (recomendado)

```bash
cp .env.example .env     # en PowerShell: Copy-Item .env.example .env
docker compose up --build
```

| Servicio | URL | Notas |
| --- | --- | --- |
| Frontend | http://localhost:5173 | Vite con hot-reload |
| Backend | http://localhost:8000 | Solo `GET /` por ahora |
| Postgres | localhost:5432 | Credenciales del `.env` |

El contenedor del frontend monta `./frontend` como volumen y usa un volumen anónimo para `node_modules`. Si cambiás `package.json`, hay que reconstruir la imagen.

### Sin Docker

```bash
cd frontend
npm install
npm run dev
```

Requiere Node 20 o superior. Scripts disponibles: `dev`, `build`, `preview`.

> Los datos viven en memoria: recargar el navegador descarta los cambios. Es intencional, para no depender de la base hasta que exista la API.

---

## Estructura del proyecto

```text
Administrador-Financiero/
├── docker-compose.yml
├── .env.example
├── backend/
│   └── app/main.py            # FastAPI mínimo, sin endpoints de negocio
└── frontend/
    ├── index.html             # HTML base, fuentes y favicon
    ├── vite.config.js
    ├── tailwind.config.js     # paleta y tipografías
    └── src/
        ├── main.jsx           # punto de entrada de React
        ├── App.jsx            # renderiza Panel
        ├── index.css          # directivas de Tailwind
        ├── Paginas/           # vistas de primer nivel
        │   ├── Panel.jsx
        │   ├── Movimientos.jsx
        │   ├── Etiquetas.jsx
        │   └── Graficos.jsx
        ├── Estructuras/       # piezas de layout reutilizables
        │   ├── Layout.jsx
        │   ├── Tabs.jsx
        │   ├── Modal.jsx
        │   └── BarraAcciones.jsx
        ├── Componentes/       # UI de dominio y controles
        │   ├── Movimiento.jsx
        │   ├── FormularioMovimiento.jsx
        │   ├── ConfirmarEliminacion.jsx
        │   ├── AccionesMovimiento.jsx
        │   ├── Etiqueta.jsx
        │   ├── FilaEtiquetas.jsx
        │   ├── Paginado.jsx
        │   └── BotonAgregar.jsx
        ├── Servicios/         # "API" simulada
        │   ├── etiquetas.js
        │   ├── movimientos.js
        │   └── simulador.js
        ├── Constantes/
        │   └── estilos.js     # colores de etiquetas y tipos de movimiento
        └── Utils/
            └── fechas.js      # conversión entre ISO y dd/mm/aa
```

### Qué va en cada carpeta

| Carpeta | Responsabilidad |
| --- | --- |
| `Paginas/` | Una vista por sección. Orquestan datos, estado y composición. |
| `Estructuras/` | Envoltorios de layout sin lógica de negocio: marco, tabs, modal, barra inferior. |
| `Componentes/` | Piezas de UI: filas, formularios, badges, paginador. |
| `Servicios/` | Acceso a datos. Hoy mock; mañana HTTP. Los componentes no saben de dónde vienen los datos. |
| `Constantes/` | Valores compartidos de presentación (colores, estilos por tipo). |
| `Utils/` | Funciones puras sin React. |

La regla implícita: **las páginas hablan con los servicios; los componentes reciben props y emiten eventos**. Así, cambiar el mock por una API no obliga a tocar la UI.

---

## Cómo funciona: de `index.html` al componente

```text
index.html
  └── <div id="root">
        └── src/main.jsx
              └── <StrictMode>
                    └── <App>
                          └── <Panel>        ← dueño de la vista y de las etiquetas
                                └── <Layout>
                                      ├── <Tabs>
                                      └── sección activa
```

1. `index.html` carga `/src/main.jsx` como módulo ES.
2. `main.jsx` monta React sobre `#root` y activa `StrictMode`.
3. `App.jsx` solo devuelve `<Panel />`; no tiene lógica.
4. `Panel` es el componente raíz real: mantiene la sección visible y el catálogo de etiquetas.
5. `Layout` aplica el marco visual: fondo, ancho máximo, padding y título.

> `StrictMode` ejecuta los efectos dos veces en desarrollo. Por eso `Panel` y `Movimientos` usan una bandera `cancelado` en el cleanup: evitan que la primera respuesta (la descartada) pise el estado.

### Árbol de componentes por sección

```text
Panel
├── Layout
│   ├── header con título
│   ├── Tabs
│   └── sección activa
│
├── Movimientos
│   ├── Movimiento
│   │   ├── Etiqueta
│   │   └── AccionesMovimiento
│   ├── Modal
│   │   ├── FormularioMovimiento
│   │   └── ConfirmarEliminacion
│   └── BarraAcciones
│       ├── BotonAgregar
│       └── Paginado
│
├── Etiquetas
│   ├── FilaEtiqueta           (archivo: FilaEtiquetas.jsx)
│   └── BarraAcciones
│       ├── BotonAgregar
│       └── Paginado
│
└── Graficos                   (placeholder)
```

---

## Navegación sin router

No hay URLs por sección. `Panel` guarda `vista` en `useState` y renderiza una de las tres páginas:

```jsx
const [vista, setVista] = useState('movimientos')

const SECCIONES = [
  { id: 'movimientos', texto: 'Menú' },
  { id: 'etiquetas', texto: 'Etiquetas' },
  { id: 'graficos', texto: 'Gráfico' },
]
```

`Tabs` es un componente **controlado**: recibe `items`, la sección `activa` y `alCambiar`. No guarda estado propio; solo avisa qué se clickeó.

```jsx
<Tabs items={SECCIONES} activa={vista} alCambiar={setVista} />
```

Consecuencias de esta decisión:

- Recargar siempre vuelve a `movimientos`.
- No se puede compartir un link a Etiquetas ni usar el botón Atrás.
- Al cambiar de sección se **desmonta** la página anterior: se pierde la página del paginador y los modales abiertos.
- Para un panel personal es aceptable; cuando haya login y rutas de admin, lo natural es migrar a React Router y mover las vistas a `Paginas/Admin/`.

---

## Quién es dueño del estado

| Estado | Vive en | Tipo | Motivo |
| --- | --- | --- | --- |
| `vista` | `Panel` | `useState` | Decide qué página se muestra |
| `etiquetas` | `Panel` | `useState` | Catálogo completo, compartido por tres secciones |
| `etiquetasActivas` | `Panel` | `useState` | Subconjunto para el formulario de movimientos |
| `errorEtiquetas` | `Panel` | `useState` | Error de carga del catálogo |
| `pagina` | `Movimientos` | `useState` | Cambia por interacción del usuario |
| `paginasData` | `Movimientos` | `useState` | Respuesta paginada del servicio |
| `cargado` / `error` | `Movimientos` | `useState` | Feedback de red |
| `modalActivo`, `movimientoEditando`, `movimientoEliminando` | `Movimientos` | `useState` | Máquina de estados del modal |
| `pagina` | `Etiquetas` | `useState` | Cambia por interacción del usuario |
| `expandido` | `Movimiento` | `useState` | Acordeón mobile de cada fila |
| `movimientoNuevo`, `movimientoEnviado` | `FormularioMovimiento` | `useState` | Borrador del formulario |

### Por qué las etiquetas viven en `Panel`

`Panel` carga el catálogo una sola vez y lo pasa hacia abajo:

- `Movimientos` lo necesita para resolver `etiquetaId → etiqueta` y mostrar el badge de cada fila, incluso si la etiqueta está inactiva.
- `Etiquetas` lo muestra en la tabla, sin volver a pedirlo.
- `Graficos` lo va a necesitar para nombres y colores.

Si cada página pidiera sus propias etiquetas, habría tres copias y tres fuentes de verdad. Con el catálogo en `Panel` hay una sola carga y una sola recarga (`recargarEtiquetas`), que se pasa como `alCambiarEtiquetas` para después de crear, editar o desactivar.

### Por qué hay dos listas (`etiquetas` y `etiquetasActivas`)

- `etiquetas`: todas, para mostrar y para resolver badges de movimientos viejos.
- `etiquetasActivas`: solo las activas, porque el formulario de movimientos no debería permitir elegir una etiqueta dada de baja.

Se piden juntas con `Promise.all` para no encadenar dos esperas.

### Regla que se sigue

- **`useState`** para lo que cambia por interacción y no se puede calcular: página actual, modal abierto, texto del formulario.
- **`const` derivado** para lo que sale de props o estado: `paginasCant`, `paginaActual`, `inicio`, la porción visible, las clases condicionales.
- Nunca estado para algo que se recalcula solo, porque hay que sincronizarlo a mano.

---

## Flujo de datos

### Carga inicial

```text
Panel (mount)
  └── useEffect
        └── Promise.all([obtenerEtiquetas(), obtenerEtiquetasActivas()])
              ├── setEtiquetas(todas)
              ├── setEtiquetasActivas(activas)
              └── setErrorEtiquetas(null)
                    ↓ props
        ├── Movimientos(etiquetas, etiquetasActivas) → su propio fetch de movimientos
        ├── Etiquetas(etiquetas, alCambiarEtiquetas) → solo render
        └── Graficos(etiquetas)                      → futuro gráfico
```

### Movimientos: paginación en el servidor

```text
Cambia pagina
  └── useEffect([pagina])
        └── cargarPaginas()
              └── obtenerMovimientos({ pagina })
                    └── { movimientos, paginasCant }
                          ├── fuera de rango → setPagina(...) y reintenta
                          └── setPaginasData(...) → render de la página
```

Cada cambio de página es un pedido nuevo: el servicio filtra, ordena y corta la página. El cliente nunca tiene la lista completa.

### Crear, editar y eliminar un movimiento

```text
Click en + / lápiz / tacho
  └── abre Modal con uno de tres estados
        ├── crear:     FormularioMovimiento sin datos
        ├── editar:    FormularioMovimiento con movimientoEditando
        └── eliminar:  ConfirmarEliminacion
              └── servicio (crearMovimiento / editarMovimiento / eliminarMovimiento)
                    └── cerrar modal + recargar
```

`recargarLista()` tiene un detalle: si estás en la página 1, vuelve a pedirla; si estás en otra, hace `setPagina(1)`. El efecto de `[pagina]` se encarga de la recarga. Así no hay dos fetches ni queda una lista vieja.

### Etiquetas: todo en el cliente

```text
Panel ya cargó etiquetas
  └── Etiquetas recibe la lista completa
        ├── calcula paginasCant y la porción visible con slice
        ├── renderiza la página
        └── BarraAcciones cambia pagina (solo estado local)
```

No hay fetch en `Etiquetas`. Cambiar de página no dispara ninguna espera: es un `slice` sobre datos que ya están en memoria.

---

## Modelo de datos

### Etiqueta

```js
{
  id: 1004,
  nombre: "Gasto Irresponsable",
  color: "bg-red-600",   // clase de Tailwind, no un hex
  activa: false
}
```

| Campo | Tipo | Notas |
| --- | --- | --- |
| `id` | number | Generado por el simulador |
| `nombre` | string | Sin validación de duplicados |
| `color` | string | Clase completa de Tailwind (`bg-*`) |
| `activa` | boolean | `false` equivale a "dada de baja" (borrado lógico) |

### Movimiento

```js
{
  id: 1001,
  tipo: "Gasto",              // clave de TIPOS_MOVIMIENTO
  monto: 5336.18,             // número, en ARS
  descripcion: "Comida + Speed",
  etiquetaId: 1000,           // referencia lógica a una etiqueta
  fecha: "2026-09-15",        // ISO, sin hora ni zona
  eliminado: false
}
```

| Campo | Tipo | Notas |
| --- | --- | --- |
| `tipo` | `"Ingreso" \| "Gasto" \| "Deuda" \| "Ahorro"` | Es a la vez dato y clave de estilos |
| `monto` | number | Positivo siempre; el signo lo da el tipo al mostrarse |
| `etiquetaId` | number | No hay integridad referencial: puede apuntar a una etiqueta inactiva o inexistente |
| `fecha` | string ISO | Se ordena con `localeCompare`, no con `Date` |
| `eliminado` | boolean | Borrado lógico: el registro sigue existiendo, pero no se lista |

Las fechas se guardan como texto `YYYY-MM-DD` y se formatean recién al renderizar. Ventaja: no hay corrimientos de zona horaria al convertir `Date → string`. Desventaja: cualquier cálculo de fechas necesita parsear.

---

## La capa de servicios

`src/Servicios/` simula una API:

- Todas las funciones son `async`.
- Todas esperan entre 200 y 500 ms (`esperar()`) para que la UI tenga estados de carga reales.
- Los datos viven en arrays a nivel de módulo. Persisten mientras dure la pestaña; se resetean al recargar.
- Los IDs salen de contadores en `simulador.js`.
- Ninguna función falla: no hay errores de red simulados. Los `try/catch` de la UI existen, pero hoy no se pueden disparar.

### Contratos

```js
// etiquetas.js
obtenerEtiquetas()                 // → Etiqueta[]
obtenerEtiquetasActivas()          // → Etiqueta[]
crearEtiqueta({ nombre, color })   // → Etiqueta
editarEtiqueta(id, cambios)        // → Etiqueta | null
eliminarEtiqueta(id)               // → Etiqueta | null  (activa = false)

// movimientos.js
obtenerMovimientos({ pagina, porPagina })
  // → { movimientos: Movimiento[], paginasCant: number }
crearMovimiento(datos)             // → Movimiento
editarMovimiento(id, cambios)      // → Movimiento | null
eliminarMovimiento(id)             // → Movimiento | null  (eliminado = true)
obtenerMovimientosEliminados()     // → Movimiento[]        (sin uso en la UI)
eliminarMovimientoDefinitivo(id)   // → Movimiento | null   (sin uso en la UI)
```

### Detalles que importan

- `obtenerEtiquetas()` devuelve una **copia del array** (`[...etiquetas]`), pero los objetos son los mismos. Tratar el resultado como inmutable: mutar un objeto devuelto modifica el "servidor" mock.
- `obtenerMovimientos()` filtra los eliminados, ordena por fecha descendente y corta la página. El `filter` crea un array nuevo, así que el `sort` no altera el original.
- El borrado es lógico en ambos dominios: `eliminado` y `activa`. Los registros siguen en memoria.
- `crearMovimiento()` y `crearEtiqueta()` no validan nada: aceptan tipos inválidos, montos negativos, etiquetas inexistentes o nombres repetidos. La validación hoy es solo la del HTML (`required`).
- `editarMovimiento()` hace `Object.assign`, así que acepta cualquier campo, incluido `id` o `eliminado`, si el llamador los manda.

### IDs

```js
let idEtiquetas = 1006     // último id de la semilla de etiquetas
let idMovimientos = 1013   // último id de la semilla de movimientos

generarIdEtiquetas()       // incrementa y devuelve → 1007, 1008...
generarIdMovimientos()     // incrementa y devuelve → 1014, 1015...
```

Si agregás datos de ejemplo, actualizá el contador correspondiente. Si no, el próximo registro creado choca con un id existente.

---

## Paginación: dos estrategias

El proyecto usa dos enfoques distintos, y la diferencia es deliberada.

| | Movimientos | Etiquetas |
| --- | --- | --- |
| Dónde se pagina | Servicio | Componente |
| Quién conoce el total | Servicio (`paginasCant`) | Cliente (`etiquetas.length`) |
| Al cambiar de página | Nuevo pedido | `slice` local |
| Estado | `pagina` + `paginasData` | `pagina` |
| Datos en memoria del cliente | Solo la página actual | Catálogo completo |

### Movimientos: paginación de servidor

```js
const { movimientos, paginasCant } = paginasData
```

El servicio hace:

```js
const movimientosAux = movimientos
  .filter((mov) => !mov.eliminado)
  .sort((a, b) => b.fecha.localeCompare(a.fecha))

const paginaMovimiento = movimientosAux.slice(inicio, fin)
return { movimientos: paginaMovimiento, paginasCant: Math.ceil(total / porPagina) }
```

La UI además se protege de páginas inválidas:

- Si no hay movimientos y no estás en la página 1, vuelve a la 1.
- Si la página pedida supera `paginasCant`, se corrige a la última.

Eso cubre el caso de eliminar el último movimiento de la última página.

### Etiquetas: paginación de cliente

```js
const POR_PAGINA = 5
const [pagina, setPagina] = useState(1)

const paginasCant = Math.ceil(etiquetas.length / POR_PAGINA)
const paginaActual = Math.min(pagina, Math.max(1, paginasCant))
const inicio = (paginaActual - 1) * POR_PAGINA
const etiquetasPagina = etiquetas.slice(inicio, inicio + POR_PAGINA)
```

Por qué acá sí se trae todo:

- Son pocas etiquetas y no se espera que crezcan como los movimientos.
- `Panel` necesita el catálogo completo de todos modos, para los badges de movimientos y el gráfico.
- Paginar en el servicio obligaría a `Panel` a pedir dos cosas distintas (todas y una página) y duplicaría la fuente de verdad.

`paginaActual` es un valor derivado que limita la página guardada al rango válido. `etiquetasPagina` es solo un `slice`, no muta la prop.

### El paginador

`Paginado` es tonto: recibe `pagina`, `paginasCant` y `setPagina`.

- Si hay 0 o 1 páginas, no renderiza nada.
- En mobile muestra `2/5`; desde `sm` muestra los números.
- Deshabilita anterior en la primera y siguiente en la última.
- Usa `setPagina((p) => p - 1)` para no depender de un valor viejo.

`BarraAcciones` lo combina con el botón `+` en una grilla de tres columnas: hueco a la izquierda, botón al centro, paginador a la derecha. Es la misma barra en las dos secciones.

---

## Diseño responsive

Tailwind es mobile-first: los estilos base aplican a celular y los prefijos (`sm:`, `lg:`) agregan cambios hacia arriba.

| Prefijo | Desde | Uso en el proyecto |
| --- | --- | --- |
| `sm` | 640 px | Números del paginador, padding de filas, botones del modal en fila |
| `lg` | 1024 px | Tabla de movimientos vs. acordeón, modal como tarjeta centrada |

### Movimientos: dos renders, una fila

- **Mobile / tablet (`< lg`)**: cada movimiento es un acordeón. Se ve la descripción grande; al tocar, se despliegan fecha, tipo, etiqueta, monto y acciones.
- **Desktop (`lg+`)**: fila de tabla con fecha, badge de etiqueta, descripción, monto y acciones alineadas.

No es la misma fila reacomodada con CSS: son dos bloques distintos, uno oculto en cada breakpoint. Cuesta duplicar markup, pero permite una experiencia mucho mejor que una tabla aplastada.

### Patrones que se repiten

```jsx
<div className="flex items-center gap-3 px-4 py-4 sm:px-6">
  <span className="h-3 w-3 shrink-0 rounded-full ..." />
  <span className="min-w-0 flex-1 truncate ...">{nombre}</span>
  <span className="shrink-0 ...">Activa</span>
</div>
```

- `flex-1` + `min-w-0` + `truncate`: el texto largo se corta con puntos suspensivos en vez de romper la fila.
- `shrink-0`: el punto de color y el badge nunca se achican.
- `title={nombre}`: el nombre completo aparece al pasar el mouse cuando está truncado.
- `flex-wrap` en footers para que el contador y el paginador se acomoden en pantallas chicas.

### Modal

- En mobile ocupa toda la pantalla, con header sticky y scroll interno.
- Desde `lg` es una tarjeta centrada, con máximo `90vh` de alto y `max-w-lg` de ancho.
- Click en el fondo cierra; click dentro no (`stopPropagation`).

### Tabla angosta

La lista de etiquetas no usa tabla HTML: usa `ul`/`li` con flex. Es más simple de hacer responsive y evita el scroll horizontal.

---

## Estilos y convenciones visuales

### Paleta

Definida en `tailwind.config.js`:

| Token | Hex | Uso |
| --- | --- | --- |
| `ink` | `#1C2321` | Texto principal; con opacidad (`ink/60`, `ink/10`) para secundarios y bordes |
| `paper` | `#F7F5F0` | Fondo general |
| `moss` | `#3A5A40` | Verde definido en la paleta, todavía sin uso |
| `clay` | `#B5651D` | Color de las deudas |

Tipografías: Inter para texto y JetBrains Mono declarada aunque sin uso; los números se alinean con `tabular-nums`.

### Clases guardadas en datos

```js
export const COLORES_ETIQUETAS = Object.freeze({
  AZUL: 'bg-blue-500',
  ROJO: 'bg-red-600',
  VERDE: 'bg-green-600',
  AMARILLO: 'bg-yellow-400',
})
```

La etiqueta guarda `color: 'bg-red-600'` y la UI lo concatena:

```jsx
<span className={`... ${etiqueta.color}`} />
```

Funciona porque Tailwind escanea el código y esas clases aparecen como strings literales. **Nunca** construir clases dinámicamente (`bg-${nombre}`): el escáner no las ve y no se generan.

Esta decisión mezcla presentación con datos. Es práctica para un mock; con una API real conviene guardar un identificador (`"rojo"`) o un hex y mapear a clases en el frontend.

### Tipos de movimiento

```js
export const TIPOS_MOVIMIENTO = Object.freeze({
  Ingreso: { signo: '+', claseTexto: 'text-lime-500', colorGrafico: '#84CC16' },
  Gasto:   { signo: '-', claseTexto: 'text-red-700',  colorGrafico: '#B91C1C' },
  Deuda:   { signo: '-', claseTexto: 'text-clay',     colorGrafico: '#B5651D' },
  Ahorro:  { signo: '',  claseTexto: 'text-blue-700', colorGrafico: '#1D4ED8' },
})
```

Se usa para tres cosas: opciones del `<select>`, color y signo del monto, y el color futuro del gráfico. Las claves son los valores que se guardan en `movimiento.tipo`, así que agregar un tipo implica tocar este objeto y nada más (por ahora).

### Formato de números y fechas

- Montos: `monto.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })`.
- Fechas: `formatearFecha('2026-09-15')` → `15/09/26` (día/mes/año de dos dígitos).
- El formulario genera la fecha de hoy en horario local, no con `toISOString()`, para no salir un día antes por la zona horaria.

---

## Estados de UI y accesibilidad

### Carga, error y vacío

| Pantalla | Carga | Error | Vacío |
| --- | --- | --- | --- |
| Panel (etiquetas) | Sin indicador | Mensaje rojo si falla | — |
| Movimientos | `Cargando movimientos...` | Mensaje rojo | Texto con invitación a usar `+` |
| Etiquetas | Sin indicador | No maneja | `Todavía no hay etiquetas cargadas.` |

`Movimientos` además baja la opacidad de la lista (`opacity-50`) mientras recarga, en vez de desmontarla. Eso evita el salto de layout al cambiar de página.

### Accesibilidad

Lo que ya está:

- `nav role="tablist"` y botones `role="tab"` con `aria-selected`.
- `aria-label` en botones de ícono (cerrar, anterior, siguiente, editar, eliminar).
- `aria-expanded` en el acordeón mobile.
- Modal con `role="dialog"`, `aria-modal` y `aria-label` con el título.
- `aria-current="page"` en la página activa del paginador.
- Texto truncado con `title` para ver el completo.

Lo que falta:

- El modal no atrapa el foco ni se cierra con `Escape`.
- Los tabs no están vinculados a su panel (`aria-controls` / `role="tabpanel"`).
- El badge amarillo usa texto blanco: contraste bajo.

---

## Decisiones de diseño

| Decisión | Por qué |
| --- | --- |
| Servicios mock en vez de API | Permite construir y probar la UI completa sin backend ni base |
| Estado de etiquetas en `Panel` | Una sola carga, compartida por movimientos, etiquetas y gráfico |
| Paginar movimientos en el servicio | Es el dominio que crece; el cliente no necesita la lista completa |
| Paginar etiquetas en el cliente | Son pocas y `Panel` ya necesita el catálogo completo |
| Navegación por estado (`vista`) | Menos dependencias para tres secciones; el router queda para cuando haya auth |
| Borrado lógico | Conserva historial y permite deshacer más adelante |
| Montos como número y fechas ISO | Ordenar y formatear es simple; el formato es cosa de la vista |
| Sin TypeScript ni librería de estado | El proyecto es chico y se prioriza aprender los fundamentos de React |
| Tailwind en vez de CSS modules | Consistencia visual rápida y responsive sin archivos extra |

---

## Problemas conocidos y deuda técnica

Cosas que hoy funcionan a medias o que conviene arreglar antes de seguir:

**Etiquetas**

- El `+` ejecuta `alert("Pa crear etiquetas")`. Hasta que exista el formulario conviene ocultarlo (`{alAgregar && <BotonAgregar ... />}` en `BarraAcciones`).
- El componente de fila está en `FilaEtiquetas.jsx` (plural) pero se llama `FilaEtiqueta` (singular). Conviene renombrar el archivo.
- El estado inactivo se muestra como "Desuso" y con fondo rojo. "Inactiva" con un gris neutro es más coherente con `activa: false`; el rojo se lee como error.
- `BarraAcciones` recibe `pagina` en vez de `paginaActual`. Hoy no se nota, pero puede mostrar una página fuera de rango.
- Si no hay etiquetas, el early return esconde también la barra: no habría forma de crear la primera.
- No hay estado de carga: al entrar rápido se ve el mensaje de vacío por un instante.
- `alCambiarEtiquetas` se pasa desde `Panel` pero todavía no se usa.

**Movimientos**

- Al editar un movimiento cuya etiqueta está inactiva (por ejemplo los que usan la etiqueta 1004), el `<select>` no tiene esa opción: queda vacío y el formulario no deja guardar hasta elegir otra.
- `ConfirmarEliminacion` muestra la fecha cruda (`2026-09-02`) en vez de formateada, y no maneja errores: si el servicio fallara, el botón quedaría en "Eliminando...".
- `FormularioMovimiento` solo hace `console.error` si falla el guardado.
- `BotonAgregar` tiene `aria-label="Agregar movimiento"` fijo. En etiquetas sería incorrecto cuando se active.

**General**

- No hay tests, linter ni Prettier.
- No hay PropTypes ni TypeScript: los contratos de props viven en la cabeza y en este README.
- `recharts` está instalado y sin usar.
- Código sin uso: `desformatearFecha`, `obtenerMovimientosEliminados`, `eliminarMovimientoDefinitivo`, y todo el CRUD de etiquetas.
- `Graficos` recibe `etiquetas` pero no lo usa.
- `Panel` repite la lógica de carga en el efecto y en `recargarEtiquetas`.
- Las funciones de formato de moneda están duplicadas en varios componentes.

---

## Próximos pasos

1. **Crear etiquetas**: formulario con nombre y selector de color, modal reutilizando `Modal`, `crearEtiqueta()` y `alCambiarEtiquetas()` al guardar. Activar el `+` de `BarraAcciones`.
2. **Editar y desactivar etiquetas**: acciones por fila, reutilizando el patrón de `Movimientos`.
3. **Pulir la tabla de etiquetas**: renombrar el archivo, badge "Inactiva", orden por activas y nombre, estado de carga.
4. **Gráfico**: usar `recharts` y los colores de `TIPOS_MOVIMIENTO`; necesita el catálogo y los movimientos.
5. **Router y auth**: mover vistas a `Paginas/Admin/`, agregar login y separar datos por usuario.
6. **API real**: reemplazar `Servicios/` por llamadas HTTP manteniendo los mismos contratos; ahí sí tiene sentido paginar también las etiquetas si crecen.
7. **Calidad**: tests de los servicios y de la paginación, ESLint/Prettier, y extraer utilidades de formato.

---

## Glosario

- **Etiqueta**: categoría de un movimiento (Super, Alquiler, Gym...). Puede estar activa o dada de baja.
- **Movimiento**: registro de dinero con tipo, monto, descripción, etiqueta y fecha.
- **Borrado lógico**: marcar un registro como eliminado/inactivo sin sacarlo de la estructura de datos.
- **Paginación de servidor**: el servicio devuelve solo la página pedida y el total de páginas.
- **Paginación de cliente**: el cliente recibe todo y corta la porción visible.
- **Componente controlado**: no guarda su propio estado; recibe valor y callback (`Tabs`, `Paginado`, inputs del formulario).
- **Valor derivado**: variable calculada en cada render a partir de props o estado, sin `useState`.
