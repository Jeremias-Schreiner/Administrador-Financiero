export function formatearFecha(fechaISO){
    //toReversed es un metodo nuevo, podria no funcionar en 
    //navegadores viejos
    let fechaList = fechaISO.split("-").toReversed()
    //realmente no es necesario el ternario aca pero para que sea mas generico
    //lo agrego
    fechaList[0] = fechaList[0].length === 1? "0"+fechaList[0] : fechaList[0]
    fechaList[1] = fechaList[1].length === 1? "0"+fechaList[1] : fechaList[1]
    fechaList[2] = fechaList[2].slice(2)
    return  fechaList.join('/')
}

export function desformatearFecha(fechaVisual){
    let fechaList = fechaVisual.split('/').toReversed()
    fechaList[1] = fechaList[1].length === 1? "0"+fechaList[1] : fechaList[1]
    fechaList[2] = fechaList[2].length === 1? "0"+fechaList[2] : fechaList[2]
    fechaList[0] = "20" + fechaList[0] 
    return fechaList.join('-')
}