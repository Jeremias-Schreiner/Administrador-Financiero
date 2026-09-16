// archivo de utils para simular el comportamiento de la bbd y tiempos de 
// espera de una api

let idEtiquetas = 1004
export function generarIdEtiquetas(){
    idEtiquetas ++
    return idEtiquetas
}

let idMovimientos = 1004
export function generarIdMovimientos(){
    idMovimientos ++
    return idMovimientos
}

export function esperar(msMin = 200, msMax = 500){
    const ms = Math.floor(Math.random() * (msMax - msMin +1 )) + msMin
    return new Promise((resolve)=>{setTimeout(resolve, ms)})
}