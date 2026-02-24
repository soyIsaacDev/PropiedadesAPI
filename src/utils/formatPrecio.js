
const formatPrecio = (precio, tipodeOperacionId = 1) => {
    // Renta (Formato Miles)
    if(tipodeOperacionId === 3) {
        return precio/1000;
    }
    // Venta (Formato Millones)
    return precio/1000000;
}

module.exports =  formatPrecio;