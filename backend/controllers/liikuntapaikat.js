const liikuntapaikkaRouter = require('express').Router()
const http = require('http')


// Default kysely vaihtoehdot, lähinnä vaihdetaan path
const options = {
    host: 'lipas.cc.jyu.fi',
    path: '/api/sports-places?fields=properties',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
}

// ei valmis; aloituskysely tietyn alueen paikoista
// paikkoja saa 1-100 per sivu pageSize parametrilla, default 50, sivuja 817 as of 24.10.2021
liikuntapaikkaRouter.get('/', async (request, response) => {
    getNHandleJSON(options, (input => response.send(input)))
})

// Palauttaa kaikki liikuntapaikkatyypit
liikuntapaikkaRouter.get('/types', async (request, response) => {
    options.path = '/api/sports-place-types?lang=fi'
    getNHandleJSON(options, (input => response.send(input)))
})

// Yksittäisen paikan kysely idllä
liikuntapaikkaRouter.get('/:id', async (request, response) => {
    options.path = '/api/sports-places/' + request.params.id
    getNHandleJSON(options, (input => response.send(input)))
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