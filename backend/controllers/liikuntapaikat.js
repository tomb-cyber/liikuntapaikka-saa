const liikuntapaikkaRouter = require('express').Router()
const http = require('http')
const utils = require('../utils/utilityFuncs')


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
liikuntapaikkaRouter.get('/', (request, response) => {

    options.path = defaultPath + '?fields=name&fields=type.name&fields=location.geometries&pageSize=100'

    let longitude = ''
    let latitude = ''
    let radius = ''
    let page = ''
    let search = ''
    //let params = [ longitude, latitude, radius, page, search ]

    if (request.query.lon !== undefined && request.query.lat !== undefined && request.query.rad !== undefined) {
        longitude = 'closeToLon=' + request.query.lon
        latitude = 'closeToLat=' + request.query.lat
        radius = 'closeToDistanceKm=' + request.query.rad
    }
    if (request.query.page !== undefined) {
        page = 'page=' + request.query.page
    }
    if (request.query.searchString !== undefined) {
        search = 'searchString=' + encodeURIComponent(request.query.searchString)
    }

    let params = [ longitude, latitude, radius, page, search ]
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


    getNHandleJSON(options, (input, status, count) => {
        console.log(status, 'Number of places:', count) // Jos undefined kaikki palautettu
        let filtered = input.filter(each => each.location !== undefined)
        response.status(status)
        console.log('Has duplicates: ' + utils.hasDuplicates(filtered))
        response.send({ places: filtered, count: count })
    })
})


// Hakee kaikki liikuntapaikat. TARKOITETTU VAIN TIETOKANTAAN SIIRTÄMISEEN
liikuntapaikkaRouter.get('/all', async (request, response) => {

    options.path = defaultPath + '?fields=name&fields=location.geometries&page=1&pageSize=100'

    let objArray = []
    //let counter = 1

    const perusGet = options => {
        getNHandleJSON(options, (input, status) => {
            console.log(status)
            let filtered = input.filter(each => each.location !== undefined)
            objArray = objArray.concat(filtered)
            if (
                //counter < 10)
                status === 206)
            {
                //counter++
                options.path = utils.nextPage(options.path)
                perusGet(options)
            }
            else {
                const idArray = objArray.map(paikka => paikka.sportsPlaceId)
                //idArray.push(idArray[0])
                //objArray.push(objArray[0])
                console.log('Has duplicates: ' + utils.hasDuplicates(idArray))
                console.log('Length: ' + idArray.length)
                response.status(status)
                response.send(objArray)
            }
        })
    }

    perusGet(options)
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
            handleResult(obj, response.statusCode, response.headers['x-total-count'])
        })
    })

    request.on('error', e =>
        console.log('ERROR: ' + e.message)
    )

    request.end()
}


module.exports = liikuntapaikkaRouter