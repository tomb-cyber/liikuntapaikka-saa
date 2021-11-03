var Metolib = require('@fmidev/metolib') // "couldn't find declaration file"

/* get('/:bbox', async (request, response) => {
    bbox = request.params.bbox
    // hae parserilta data valitulla sijainnilla
}) */

const url = 'http://opendata.fmi.fi/wfs'
const query = 'fmi::forecast::hirlam::surface::point::simple'
// asynkronisesti pyytää XML datan ja vastaanottaa sen parsettuna JSON:ksi
// objekti parserin sisällä erilliseksi muuttujaksi, että arvoihin päästään käsiksi?
var parser = new Metolib.WfsRequestParser()
parser.getData({
    url: url,
    storedQueryId: query,
    requestParameter : 'Temperature,WeatherSymbol3,WindSpeedMS',
    timestep : 20,
    // bbox : "min lat,min lon,max lat,max lon", tarkka sijainti kartalta
    sites: 'Jyväskylä', // vaihdetaan bbox kun bbox toteutus on tiedossa
    callback : function(data) {
        const weather = data // mitä halutaan tehdä parsetetulla datalla
    }
})