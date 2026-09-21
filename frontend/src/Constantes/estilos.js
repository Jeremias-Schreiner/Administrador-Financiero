//colores utilizados por las etiquetas del sistemas
export const COLORES_ETIQUETAS = Object.freeze({
  AZUL: 'bg-blue-500', 
  ROJO: 'bg-red-600',
  VERDE: 'bg-green-600',
  AMARILLO: 'bg-yellow-400'
})

// Tipos de movimientos, incluye si es favorable, el estilo en tailwind y su hex para el grafico
export const TIPOS_MOVIMIENTO = Object.freeze({
  Ingreso: { signo: '+', claseTexto: 'text-lime-500', colorGrafico: '#84CC16' },
  Gasto:   { signo: '-', claseTexto: 'text-red-700',  colorGrafico: '#B91C1C' },
  Deuda:   { signo: '-', claseTexto: 'text-clay',     colorGrafico: '#B5651D' },
  Ahorro:  { signo: '',  claseTexto: 'text-blue-700', colorGrafico: '#1D4ED8' },
})