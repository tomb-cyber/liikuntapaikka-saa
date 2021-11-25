import Metolib from '@fmidev/metolib'

const parser = new Metolib.WfsRequestParser()
const url = 'http://opendata.fmi.fi/wfs'
const query = 'fmi::forecast::hirlam::surface::point::multipointcoverage'

function haeSaa(latlon//, handleCallback
) {
    parser.getData({
        url: url,
        storedQueryId: query,
        requestParameter: 'Temperature,WeatherSymbol3,WindSpeedMS',
        begin: new Date(),
        end: new Date((new Date()).getTime() + 24 * 60 * 60 * 1000),
        timestep: 20 * 60 * 1000,
        latlon: latlon,
        callback : function(data, errors) {
            if (data) {
                //handleCallback(data)      Mahdollinen toteutus datan prosessointiin App:issa -T
                console.log(data)
                return data
            }
            if (errors) {
                console.log(errors)
            }
        }
    })
}

/*
----------------------------------------------------------------------------
Datan käsittelyä varten
----------------------------------------------------------------------------
data.locations[0].data.Temperature.timeValuePairs[i] // Aika - arvo taulukko
data.locations[0].data.Temperature.timeValuePairs[i].time // Aika
data.locations[0].data.Temperature.timeValuePairs[i].value // Lämpötila tiettyyn aikaan

data.locations[0].data.WeatherSymbol3.timeValuePairs[i] // Aika - arvo taulukko
data.locations[0].data.WeatherSymbol3.timeValuePairs[i].time // Aika
data.locations[0].data.WeatherSymbol3.timeValuePairs[i].value // Säätyyppi (symboli) tiettyyn aikaan

data.locations[0].data.WindSpeedMS.timeValuePairs[i] // Aika - arvo taulukko
data.locations[0].data.WindSpeedMS.timeValuePairs[i].time // Aika
data.locations[0].data.WindSpeedMS.timeValuePairs[i].value // Tuulen nopeus tiettyyn aikaan

data.locations[0].data.WindDirection.timeValuePairs[i] // Aika - arvo taulukko
data.locations[0].data.WindDirection.timeValuePairs[i].time // Aika
data.locations[0].data.WindDirection.timeValuePairs[i].value // Tuulen suunta tiettyyn aikaan

Ajan saa muutettua oikeaan muotoon luomalla "new Date()" ja syöttämällä sille aika-arvo
*/

const exported =  { haeSaa }

export default exported