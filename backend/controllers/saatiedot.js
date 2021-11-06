const saatietoRouter = require('express').Router()
const Metolib = require('@fmidev/metolib')

saatietoRouter.get('/:latlon', async (request, response) => {
    let inputLatlon = ''
    inputLatlon = request.query.latlon
    response.send(parser.getData({ latlon: inputLatlon })) // toimiva toteutus?
})

const url = 'http://opendata.fmi.fi/wfs'
const query = 'fmi::forecast::hirlam::surface::point::simple'
var parser = new Metolib.WfsRequestParser()
parser.getData({
    url: url,
    storedQueryId: query,
    requestParameter: 'Temperature,WeatherSymbol3,WindSpeedMS',
    timestep: 20,
    latlon: (62,25), // defaulttina Jyväskylän latlon
    callback : function(data) {
        const weather = data
        return weather
    }
})

module.exports = {
    saatietoRouter
}