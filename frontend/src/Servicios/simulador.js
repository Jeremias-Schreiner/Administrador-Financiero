// archivo de utils para simular el comportamiento de la bbd y tiempos de 
// espera de una api

let idEtiquetas = 1006
export function generarIdEtiquetas(){
    idEtiquetas ++
    return idEtiquetas
}

// debe coincidir con el ultimo id usado en movimientos.js, si no el proximo
// movimiento creado quedaria con un id duplicado
let idMovimientos = 1013
export function generarIdMovimientos(){
    idMovimientos ++
    return idMovimientos
}

export function esperar(msMin = 200, msMax = 500){
    const ms = Math.floor(Math.random() * (msMax - msMin +1 )) + msMin
    return new Promise((resolve)=>{setTimeout(resolve, ms)})
}