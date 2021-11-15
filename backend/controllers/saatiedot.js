const saatietoRouter = require('express').Router()
const Metolib = require('@fmidev/metolib')

const parser = new Metolib.WfsRequestParser()
const url = 'http://opendata.fmi.fi/wfs'
const query = 'fmi::forecast::hirlam::surface::point::multipointcoverage'
var defaultPath = {
    url: url,
    storedQueryId: query,
    requestParameter: 'Temperature,WeatherSymbol3,WindSpeedMS',
    begin: new Date(),
    end: new Date((new Date()).getTime() + 24 * 60 * 60 * 1000),
    timestep: 20 * 60 * 1000,
    latlon: '62.24147,25.72088',
    callback : function(data, errors) {
        if (data) {
            console.log(data)
            return data
        }
        if (errors) {
            console.log(errors)
        }
    }
}

saatietoRouter.get('/:latlon', async (request, response) => {
    defaultPath.latlon = request.params.latlon
    response.send(parser.getData(defaultPath))
})

saatietoRouter.get('/', async (request, response) => {
    response.send(parser.getData(defaultPath))
})

module.exports = {
    saatietoRouter
}