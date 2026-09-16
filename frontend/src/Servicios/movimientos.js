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
    }
]

export async function obtenerMovimientos(){
    await esperar()
    return movimientos.filter((movimiento)=>{ return !movimiento.eliminado})
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