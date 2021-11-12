const liikuntapaikkaRouter = require('express').Router()
const http = require('http')


const defaultPath = '/api/sports-places'

// Default kysely vaihtoehdot, lähinnä muunnellaan tarpeen mukaan path
const options = {
    host: 'lipas.cc.jyu.fi',
    path: defaultPath + '?fields=location.geometries&fields=name',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}


// Peruskysely tietyn alueen paikoista (tai muilla parametreillä)
// Paikkoja saa 1-100 per sivu pageSize parametrilla, default 50, sivuja 817 as of 24.10.2021
// Kuinka monta ja millä perusteella valitaan näytettävät kun alue kattaa tuhansia paikkoja?
liikuntapaikkaRouter.get('/', async (request, response) => {

    options.path = defaultPath + '?fields=name&pageSize=100' //fields=location.geometries&

    let longitude = ''
    let latitude = ''
    let radius = ''
    let page = ''

    if (request.query.lon !== undefined && request.query.lat !== undefined && request.query.rad !== undefined) {
        longitude = 'closeToLon=' + request.query.lon
        latitude = 'closeToLat=' + request.query.lat
        radius = 'closeToDistanceKm=' + request.query.rad
    }
    if (request.query.pageNumber !== undefined) {
        page = 'page=' + request.query.pageNumber
    }

    let params = [ longitude, latitude, radius, page ]
    params = params.filter(elem => elem !== '')

    let paramsString = ''

    params.forEach((param, index) => {
        if (index === 0)
            paramsString += '&'
        else
            paramsString += '&'

        paramsString += param
    })

    options.path = options.path + paramsString
    getNHandleJSON(options, (input, status) => {
        //console.log(status)
        response.status(status)
        response.send(input//.filter(each => each.location !== undefined)
        )})
})

// Palauttaa kaikki liikuntapaikkatyypit
liikuntapaikkaRouter.get('/types', async (request, response) => {
    options.path = '/api/sports-place-types' //?lang=fi'
    getNHandleJSON(options, (input => response.send(input)))
})


// Palauttaa kaikki liikuntapaikkakategoriat
liikuntapaikkaRouter.get('/categories', async (request, response) => {
    options.path = '/api/categories'
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
            //console.log(output)
            let obj = JSON.parse(output)
            handleResult(obj, response.statusCode)
        })
    })

    request.on('error', e =>
        console.log('ERROR: ' + e.message)
    )

    request.end()
}



// säilytetään varulta, kunnes tiedetään varmaksi, ettei WFS tarvita
// liikuntapaikkaRouter.get('/wfs', async (request, response) => {
//     options.path = '/geoserver/ows?service=wfs&version=2.0.0&request=Getfeature&typename=lipas_kaikki_pisteet&count=5&outputformat=application/json'
//     getNHandleJSON(options, (input => response.send(stripCollection(input))))
// })

// liikuntapaikkaRouter.get('/:id', async (request, response) => {
//     options.path = getWFSQuery('pisteet', request.params.id)

//     // TODO if-else-paska järkeväksi!!
//     getNHandleJSON(options, (input => {
//         if (input.numberMatched !== 0)
//             response.send(stripCollection(input))
//         else {
//             options.path = getWFSQuery('alueet', request.params.id)

//             getNHandleJSON(options, (input => {
//                 if (input.numberMatched !== 0)
//                     response.send(stripCollection(input))
//                 else {
//                     options.path = getWFSQuery('reitit', request.params.id)
//                     getNHandleJSON(options, (input => {
//                         response.send(stripCollection(input))
//                     }))
//                 }
//             }))
//         }
//     }))
// })

// /**
//  * Palauttaa WFS hakuqueryn. Liikuntapaikat jaettu lipas_kaikki_pisteet, -alueet ja -reitit, joten "geometriatyyppi" pitää määritellä.
//  * @param geometria Täsmällisesti joko 'pisteet', 'alueet' tai 'reitit'
//  * @param id Liikuntapaikan id
//  * @returns WFS hakuquery
//  */
// const getWFSQuery = (geometria, id) => `/geoserver/ows?service=wfs&version=2.0.0&request=Getfeature&typename=lipas_kaikki_${ geometria }&CQL_FILTER=id=${ id }&outputformat=application/json`


// /**
//   * Extractaa liikuntapaikat Featureina FeatureCollectionista
//   * @param collection FeatureCollection
//   * @returns Liikuntapaikat Featureina
//   */
// const stripCollection = (collection) => collection.features


module.exports = liikuntapaikkaRouter