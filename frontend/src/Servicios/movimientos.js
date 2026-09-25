import { esperar,generarIdMovimientos } from "./simulador"

//deberia mostrarse en el front en formato fecha dd/mm/yy
let movimientos = [
    {
        id: 1000,
        tipo: "Ingreso",
        monto: 1700000,
        descripcion: "Sueldo Mensual",
        etiquetaId : 1003,
        fecha: "2026-09-02", 
        eliminado: false,
    },
    {
        id: 1001,
        tipo: "Gasto",
        monto: 5336.18,
        descripcion: "Comida + Speed",
        etiquetaId : 1000,
        fecha: "2026-09-15",
        eliminado: false,
    },
    {
        id: 1002,
        tipo: "Gasto",
        monto: 400000,
        descripcion: "Alquiler",
        etiquetaId : 1001,
        fecha: "2026-09-07",
        eliminado: false,
    },
    {
        id: 1003,
        tipo: "Deuda",
        monto: 54526.41,
        descripcion: "Deuda Mercadopago",
        etiquetaId : 1004,
        fecha: "2026-09-06",
        eliminado: false,
    },
    {
        id: 1004,
        tipo: "Ahorro",
        monto: 200000,
        descripcion: "Plazo fijo",
        etiquetaId: 1005,
        fecha: "2026-09-10",
        eliminado: false,
    },
    {
        id: 1005,
        tipo: "Gasto",
        monto: 18990,
        descripcion: "Supermercado Coto",
        etiquetaId: 1000,
        fecha: "2026-09-12",
        eliminado: false,
    },
    {
        id: 1006,
        tipo: "Gasto",
        monto: 15400,
        descripcion: "Entradas cine",
        etiquetaId: 1004,
        fecha: "2026-09-09",
        eliminado: false,
    },
    {
        id: 1007,
        tipo: "Gasto",
        monto: 9800,
        descripcion: "Gym mensual",
        etiquetaId: 1002,
        fecha: "2026-09-05",
        eliminado: false,
    },
    {
        id: 1008,
        tipo: "Ingreso",
        monto: 85000,
        descripcion: "Freelance diseño web",
        etiquetaId: 1003,
        fecha: "2026-08-31",
        eliminado: false,
    },
    {
        id: 1009,
        tipo: "Gasto",
        monto: 43200,
        descripcion: "Nafta",
        etiquetaId: 1006,
        fecha: "2026-08-29",
        eliminado: false,
    },
    {
        id: 1010,
        tipo: "Deuda",
        monto: 120000,
        descripcion: "Cuota notebook",
        etiquetaId: 1004,
        fecha: "2026-08-25",
        eliminado: false,
    },
    {
        id: 1011,
        tipo: "Gasto",
        monto: 400000,
        descripcion: "Alquiler",
        etiquetaId: 1001,
        fecha: "2026-08-07",
        eliminado: false,
    },
    {
        id: 1012,
        tipo: "Ingreso",
        monto: 1700000,
        descripcion: "Sueldo Mensual",
        etiquetaId: 1003,
        fecha: "2026-08-02",
        eliminado: false,
    },
    {
        id: 1013,
        tipo: "Gasto",
        monto: 32750.50,
        descripcion: "Mercado del mes",
        etiquetaId: 1000,
        fecha: "2026-08-19",
        eliminado: false,
    }
]

export async function obtenerMovimientos({ pagina = 1, porPagina= 5 }={}){
    await esperar()
    const inicioPagina = (pagina - 1) * porPagina
    const finPagina = inicioPagina + porPagina
    
    const movimientosAux = movimientos
        .filter((mov)=>!mov.eliminado)
        .sort((movA,movB)=>{return movB.fecha.localeCompare(movA.fecha)})
    

    const paginaMovimiento = movimientosAux.slice(inicioPagina,finPagina)
    const movimientosPaginas = {
        movimientos: paginaMovimiento,
        paginasCant: Math.ceil(movimientosAux.length/porPagina)
    }
    return movimientosPaginas
}

export async function crearMovimiento(movimiento) {
    await esperar()
    const movimientoNuevo = {
        id: generarIdMovimientos(),
        tipo: movimiento.tipo,
        monto: movimiento.monto,
        descripcion: movimiento.descripcion,
        etiquetaId: movimiento.etiquetaId,
        fecha: movimiento.fecha,
        eliminado: false
    }

    movimientos.push(movimientoNuevo)
    return movimientoNuevo
}

export async function editarMovimiento(id, cambios) {
    await esperar()
    const movimiento = movimientos.find((movimiento)=>{return movimiento.id === id})

    if (movimiento){
        Object.assign(movimiento, cambios)
        return movimiento
    }
    return null    
}

export async function eliminarMovimiento(id){
    await esperar()
    const movimiento = movimientos.find((movimiento)=> movimiento.id === id)

    if (movimiento){
        movimiento.eliminado = true
        return movimiento
    }
    return null
}

export async function obtenerMovimientosEliminados(){
    await esperar()
    return movimientos.filter((movimiento)=>{ return movimiento.eliminado})
}

export async function eliminarMovimientoDefinitivo(id){
    await esperar()
    const movimientoEliminar = movimientos.find((movimiento)=>{return movimiento.id === id})
    movimientos = movimientos.filter((movimiento)=>{return movimiento.id !== id})

    if (movimientoEliminar)
        return movimientoEliminar
    return null
}