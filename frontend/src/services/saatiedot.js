import Metolib from '@fmidev/metolib'
import saaSymboliTaulukko from '../../../backend/controllers/symbolitaulukko'

const parser = new Metolib.WfsRequestParser()
const url = 'http://opendata.fmi.fi/wfs'
const query = 'fmi::forecast::hirlam::surface::point::multipointcoverage'

function haeSaa(latlon) {
    var lista = []
    var saaLista = []
    var paivat = ['Sunnuntai','Maanantai','Tiistai','Keskiviikko','Torstai','Perjantai','Lauantai']
    parser.getData({
        url: url,
        storedQueryId: query,
        requestParameter: 'Temperature,WeatherSymbol3,WindSpeedMS,WindDirection',
        begin: new Date(),
        end: new Date((new Date()).getTime() + 2 * 60 * 60 * 1000),
        timestep: 20 * 60 * 1000,
        latlon: latlon,
        callback : function(data) {
            lista.push(data)
            let tempList = data.locations[0].data.Temperature.timeValuePairs
            let symbolList = data.locations[0].data.WeatherSymbol3.timeValuePairs
            let windSpeedList = data.locations[0].data.WindSpeedMS.timeValuePairs
            let windDirectionList = data.locations[0].data.WindDirection.timeValuePairs
            var saaTiedot = {}
            saaLista.push(saaTiedot)
            for (let i = 0; i < tempList.length; i++) {
                saaTiedot[i] = {
                    aika: paivat[new Date().getDay()] + ' ' + new Date(tempList[i].time).toLocaleString('fi-FI'),
                    lampotila: tempList[i].value,
                    saasymboli: haeSymboli(symbolList[i].value), // varmista toimivuus
                    tuuli_ms: windSpeedList[i].value,
                    tuulen_suunta: windDirectionList[i].value
                }
            }
        }
    })
    return saaLista
}

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

const exported =  { haeSaa }

export default exported