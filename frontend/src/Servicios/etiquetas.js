import { COLORES_ETIQUETAS } from "../Constantes/estilos"
import { esperar, generarIdEtiquetas } from "./simulador"

export const etiquetas = [
    {
        id: 1000,
        nombre: "Super",
        color: COLORES_ETIQUETAS.AZUL,
        activa: true
    },
    {
        id: 1001,
        nombre: "Alquiler",
        color: COLORES_ETIQUETAS.AMARILLO,
        activa: true
    },
    {
        id: 1002,
        nombre: "Gym",
        color: COLORES_ETIQUETAS.VERDE,
        activa: true
    },
    {
        id: 1003,
        nombre: "Trabajo",
        color: COLORES_ETIQUETAS.VERDE,
        activa: true
    },
    {
        id: 1004,
        nombre: "Gasto Irresponsable",
        color: COLORES_ETIQUETAS.ROJO,
        activa: false
    },
    {
        id:1005,
        nombre: "Ahorro",
        color: COLORES_ETIQUETAS.VERDE,
        activa: true
    },
    {
        id:1006,
        nombre: "Transporte",
        color: COLORES_ETIQUETAS.ROJO,
        activa: true
    }
]

export async function obtenerEtiquetas(){
    await esperar()
    return [...etiquetas]
}

export async function obtenerEtiquetasActivas() {
    await esperar()
    return etiquetas.filter((etiqueta)=>{ return etiqueta.activa})
}

export async function crearEtiqueta(etiqueta) {
    await esperar()
    const nuevaEtiqueta = {
        id: generarIdEtiquetas(),
        nombre: etiqueta.nombre,
        color: etiqueta.color,
        activa: true
    }

    etiquetas.push(nuevaEtiqueta)
    return nuevaEtiqueta
}

export async function editarEtiqueta(id, cambios) {
    await esperar()
    const etiqueta = etiquetas.find((etiqueta)=>{return etiqueta.id === id})

    if (etiqueta){
        Object.assign(etiqueta, cambios)
        return etiqueta
    }
    return null    
}

export async function eliminarEtiqueta(id) {
    await esperar()
    const etiqueta = etiquetas.find((etiqueta)=> etiqueta.id === id)

    if (etiqueta){
        etiqueta.activa = false
        return etiqueta
    }
    return null
}