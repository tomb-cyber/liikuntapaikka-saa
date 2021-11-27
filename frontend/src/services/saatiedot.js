import Metolib from '@fmidev/metolib'

const parser = new Metolib.WfsRequestParser()
const url = 'http://opendata.fmi.fi/wfs'
const query = 'fmi::forecast::hirlam::surface::point::multipointcoverage'
// var lista = [] -S

function haeSaa(latlon//, handleCallback -T
) {
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
                //handleCallback(data)      Mahdollinen toteutus datan prosessointiin App:issa -T
                // lista.push(data) -S
            }
        }
    })
    // return lista -S
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
^ Kutsutaan haeSymboli(value) jossa value on data.locations[0].data.WeatherSymbol3.timeValuePairs[i].value

data.locations[0].data.WindSpeedMS.timeValuePairs[i] // Aika - arvo taulukko
data.locations[0].data.WindSpeedMS.timeValuePairs[i].time // Aika
data.locations[0].data.WindSpeedMS.timeValuePairs[i].value // Tuulen nopeus tiettyyn aikaan

data.locations[0].data.WindDirection.timeValuePairs[i] // Aika - arvo taulukko
data.locations[0].data.WindDirection.timeValuePairs[i].time // Aika
data.locations[0].data.WindDirection.timeValuePairs[i].value // Tuulen suunta tiettyyn aikaan
^ Tähän myös oma toteutus että saadaan arvoa vastaava nuolen kuvitus?
^ Vastaavasti voidaan määrittää ilmansuuntien mukaan lounas luode kaakko yms ja niille rajat

Ajan saa muutettua oikeaan muotoon luomalla "new Date()" ja syöttämällä sille aika-arvo
*/

const exported =  { haeSaa }

export default exported