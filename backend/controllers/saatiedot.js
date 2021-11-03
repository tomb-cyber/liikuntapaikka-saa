var Metolib = require('@fmidev/metolib')
const url = 'http://opendata.fmi.fi/wfs'
const query = 'fmi::forecast::hirlam::surface::point::simple'
// asynkronisesti pyytää XML datan ja vastaanottaa sen parsettuna JSON:ksi
var parser = new Metolib.WfsRequestParser()
parser.getData({
    url: url,
    storedQueryId: query,
    requestParameter : 'Temperature,WeatherSymbol3,WindSpeedMS',
    // timestep : 60 * 60 * 1000, jos haluaa esim 20 min välein
    // bbox : "min lat,min lon,max lat,max lon", tarkka sijainti kartalta
    sites: 'Jyväskylä', // vaihdetaan bbox kun bbox toteutus on tiedossa
    callback : function(data) {
        const weather = data // mitä halutaan tehdä parsetetulla datalla
    }
})