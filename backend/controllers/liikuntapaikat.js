const liikuntapaikkaRouter = require('express').Router()
const http = require('http')


const defaultPath = '/api/sports-places'

// Default kysely vaihtoehdot, lähinnä muunnellaan tarpeen mukaan path
const options = {
    host: 'lipas.cc.jyu.fi',
    path: defaultPath + '?fields=properties',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}

// Peruskysely tietyn alueen paikoista (tai muilla parametreillä)
// Paikkoja saa 1-100 per sivu pageSize parametrilla, default 50, sivuja 817 as of 24.10.2021
// Kuinka monta ja millä perusteella valitaan näytettävät kun alue kattaa tuhansia paikkoja?
liikuntapaikkaRouter.get('/', async (request, response) => {

    let longitude = ''
    let latitude = ''
    let radius = ''

    if (request.query.lon !== undefined && request.query.lat !== undefined && request.query.rad !== undefined) {
        longitude = 'closeToLon=' + request.query.lon
        latitude = 'closeToLat=' + request.query.lat
        radius = 'closeToDistanceKm=' + request.query.rad
    }

    let params = [ longitude, latitude, radius ]
    params = params.filter(elem => elem !== '')

    let paramsString = ''

    params.forEach((param, index) => {
        if (index === 0)
            paramsString += '?'
        else
            paramsString += '&'

        paramsString += param
    })

    options.path = defaultPath + paramsString
    getNHandleJSON(options, (input => response.send(input)))
})

// Palauttaa kaikki liikuntapaikkatyypit
liikuntapaikkaRouter.get('/types', async (request, response) => {
    options.path = '/api/sports-place-types?lang=fi'
    getNHandleJSON(options, (input => response.send(input)))
})

// Yksittäisen paikan kysely idllä
liikuntapaikkaRouter.get('/:id', async (request, response) => {
    options.path = defaultPath + '/' + request.params.id
    getNHandleJSON(options, input => response.send(input))

    //'Lon: ' + input.location.coordinates.wgs84.lon +
    //', Lat: ' + input.location.coordinates.wgs84.lat
})


/**
 * getNHandleJSON: GET-kysely lipas-APIlle, vastaus muunnetaan muotoon json ja annetaan eteenpäin handleResultille
 * @param options: http kyselyn vaihtoehdot
 * @param handleResult: metodi, jolle vastaus annetaan json muodossa
 */
const getNHandleJSON = (options, handleResult) => {
    let output = ''

    const request = http.request(options, (response) => {
        console.log(`${options.host + options.path} : ${response.statusCode}`)
        response.setEncoding('utf8')

        response.on('data', (chunk) => {
            output += chunk
        })

        response.on('end', () => {
            let obj = JSON.parse(output)
            handleResult(obj)
        })
    })

    request.on('error', e =>
        console.log('ERROR: ' + e.message)
    )

    request.end()
}


module.exports = liikuntapaikkaRouter