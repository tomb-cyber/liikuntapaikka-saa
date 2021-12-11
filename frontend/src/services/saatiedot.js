import Metolib from '@fmidev/metolib'

const parser = new Metolib.WfsRequestParser()
const url = 'https://opendata.fmi.fi/wfs'
const query = 'fmi::forecast::hirlam::surface::point::multipointcoverage'

/**
 * Tekee haun Ilmatieteenlaitoksen avoimeen dataan valitun liikuntapaikan
 * sijainnin perusteella
 * @param latlon 'Latitude, longitude' -sijainti jolle haku tehdään
 * @returns saaLista, joka sisältää hakutulosobjekteja aika-arvottain
 */
function haeSaa(latlon) {
    var saaLista = []
    var paivat = ['Su','Ma','Ti','Ke','To','Pe','La']
    parser.getData({
        url: url,
        storedQueryId: query,
        requestParameter: 'Temperature,WeatherSymbol3,WindSpeedMS,WindDirection',
        begin: new Date(),
        end: new Date((new Date()).getTime() + 2 * 60 * 60 * 1000),
        timestep: 20 * 60 * 1000,
        latlon: latlon,
        callback : function(data) {
            let tempList = data.locations[0].data.Temperature.timeValuePairs
            let symbolList = data.locations[0].data.WeatherSymbol3.timeValuePairs
            let windSpeedList = data.locations[0].data.WindSpeedMS.timeValuePairs
            let windDirectionList = data.locations[0].data.WindDirection.timeValuePairs
            var saaTiedot = {}
            for (let i = 0; i < tempList.length; i++) {
                saaTiedot = {
                    aika: paivat[new Date().getDay()] + ' ' + new Date(tempList[i].time).toLocaleString('fi-FI', {
                        day: 'numeric', month: 'numeric', hour: 'numeric', minute: 'numeric' }),
                    lampotila: tempList[i].value,
                    saasymboli: symbolList[i].value,
                    tuuli_ms: windSpeedList[i].value,
                    tuulen_suunta: windDirectionList[i].value
                }
                saaLista.push(saaTiedot)
            }
        }
    })
    return saaLista
}

export default haeSaa