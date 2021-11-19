import Metolib from '@fmidev/metolib'

const parser = new Metolib.WfsRequestParser()
const url = 'http://opendata.fmi.fi/wfs'
const query = 'fmi::forecast::hirlam::surface::point::multipointcoverage'

function haeSaa(latlon) {
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
                console.log(data)
                return data
            }
            if (errors) {
                console.log(errors)
            }
        }
    })
}

const exported =  { haeSaa }

export default exported