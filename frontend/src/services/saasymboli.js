import saaSymboliTaulukko from '../../../backend/controllers/symbolitaulukko'

/**
 * Hakee sääsymbolin kuvan datasta saadun WeatherSymbol3 valuen perusteella
 * @param {*} value WeatherSymbol3 arvo
 * @returns Sääsymbolin kuvataulukosta
 */
function haeSymboli(value) {
    let symboli
    for (let i = 0; i < saaSymboliTaulukko.length; i++) {
        if (saaSymboliTaulukko[i].src.includes(value) === true) {
            symboli = saaSymboliTaulukko[i]
        } else {
            console.log('Symbolin haku ei toiminut')
        }
    }
    return symboli
}

const exported = { haeSymboli }

export default exported
