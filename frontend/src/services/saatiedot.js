import Metolib from '@fmidev/metolib'

const parser = new Metolib.WfsRequestParser()
const url = 'http://opendata.fmi.fi/wfs'
const query = 'fmi::forecast::hirlam::surface::point::multipointcoverage'

function haeSaa(latlon) {
    var lista = []
    parser.getData({
        url: url,
        storedQueryId: query,
        requestParameter: 'Temperature,WeatherSymbol3,WindSpeedMS,WindDirection',
        begin: new Date(),
        end: new Date((new Date()).getTime() + 24 * 60 * 60 * 1000),
        timestep: 20 * 60 * 1000,
        latlon: latlon,
        callback : function(data) {
            if (data) {
                lista.push(data)
                var tiedot = lista[0]
                yhdistaTiedot(tiedot) // Tässä pitäis tehä varmaan sama listaan pushaus kikka
                // returni ei toimi täs sisäl -> funktio auki kirjoitettuna tähän eikä erillisenä?
            }
        }
    })
    return lista[0]
}

function yhdistaTiedot(data) {
    let tempList = data.locations[0].data.Temperature.timeValuePairs
    let symbolList = data.locations[0].data.WeatherSymbol3.timeValuePairs
    let windSpeedList = data.locations[0].data.WindSpeedMS.timeValuePairs
    let windDirectionList = data.locations[0].data.WindDirection.timeValuePairs
    var saaLista = []
    var saaTiedot = {}
    saaLista.push(saaTiedot)
    for (let i = 0; i < tempList.length; i++) {
        saaTiedot[i] = {
            aika: tempList[i].time,
            lampotila: tempList[i].value,
            symbooli: symbolList[i].value,
            tuuli_ms: windSpeedList[i].value,
            tuulen_suunta: windDirectionList[i].value
        }
    }
    return saaLista // palauttaa listan objekteja aika-arvottain
}

const exported =  { haeSaa }

export default exported