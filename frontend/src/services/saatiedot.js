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
function haeSaa(latlon, setWeather, timeRange) {
    console.log('time range:', timeRange)
    var saaLista = []
    var alkuAika
    var loppuAika
    var paivat = ['Su','Ma','Ti','Ke','To','Pe','La']
    // Jos ajanvalinnassa on valmiina Date objekti, käytetään sitä, muuten
    // parsitaan stringistä tunnit ja minuutit erilleen
    if (timeRange[0] instanceof Date) {
        alkuAika = timeRange[0]
    } else {
        let aikaSplit = timeRange[0].split(':')
        alkuAika = new Date().setHours(aikaSplit[0], aikaSplit[1])
    }
    if (timeRange[1] instanceof Date) {
        loppuAika = timeRange[1]
    } else {
        let aikaSplit = timeRange[1].split(':')
        loppuAika = new Date().setHours(aikaSplit[0], aikaSplit[1])
    }
    parser.getData({
        url: url,
        storedQueryId: query,
        requestParameter: 'Temperature,WeatherSymbol3,WindSpeedMS,WindDirection',
        begin: alkuAika,
        end: loppuAika,
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
                    lampotila: tempList[i].value + '°C',
                    saasymboli: symbolList[i].value,
                    tuuli_ms: windSpeedList[i].value,
                    tuulen_suunta: windDirectionList[i].value
                }
                saaLista.push(saaTiedot)
            }
            setWeather(saaLista)
        }
    })
}

export default haeSaa