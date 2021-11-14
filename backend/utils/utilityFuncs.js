
/**
 * Käy taulukon läpi duplikaattien varalta.
 * @param array Tutkittava taulukko
 * @returns True jos löytyi duplikaatteja, false jos ei
 */
exports.hasDuplicates = (array) => {
    var lapiKayty = []
    for (var i = 0; i < array.length; ++i) {
        var current = array[i]
        if (lapiKayty.indexOf(current) !== -1) {
            return true
        }
        lapiKayty.push(current)
    }
    return false
}


/**
 * Antaa path, joka palauttaa seuraavan sivun
 * @param path Osoiteen path osa, jonka page parametria kasvatetaan yhdellä
 * @returns Path yhtä isommalla page parametrilla
 */
exports.nextPage = (path) => {
    const param = 'page='
    const startIndex = path.indexOf(param)
    const nextParamStart = path.indexOf('&', startIndex + param.length)
    const ending = nextParamStart < 0 ? '' : path.substring(nextParamStart)
    let pageNum = parseInt(path.substring(startIndex + param.length, nextParamStart))
    pageNum += 1
    const newPath = path.substring(0, startIndex) + param + pageNum + ending
    return newPath
}
