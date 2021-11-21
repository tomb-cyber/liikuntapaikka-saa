import axios from 'axios'

/**
 * Palauttaa random liikuntapaikkoja demoamista varten
 * @returns Testisatsin liikuntapaikkoja
 */
const getTempStart = () => {
    const request = axios.get('/liikuntapaikat/')
    return request.then(response => {
        console.log(response.status)
        return response.data.places    //{ data: response.data, status: response.status }
    })
}


/**
 * Palauttaa kaikki liikuntapaikat
 * @returns Kaikki liikuntapaikat
 */
const getAll = () => {
    const request = axios.get('/liikuntapaikat/all')
    return request.then(response => {
        console.log(response.status)
        return response.data    //{ data: response.data, status: response.status }
    })
}


/**
 * Palauttaa random liikuntapaikkoja sivulta pageNumber
 * @param pageNumber Sivunumero
 * @returns Random liikuntapaikkoja sivulta pageNumber
 */
const getPage = (pageNumber) => {
    const request = axios.get('/liikuntapaikat?page=' + pageNumber)
    return request.then(response => {
        return response.data
    })
}


/**
 * Palauttaa annetun alueen sisällä olevia liikuntapaikkoja kysytyltä sivunumerolta
 * @param {*} lat Alueen keskipisteen latitude
 * @param {*} lon Alueen keskipisteen longitude
 * @param {*} rad Alueen säde
 * @param {*} page Löydettyjen paikkojen sivunumero
 * @returns Annetun alueen sisällä olevia liikuntapaikkoja kysytyltä sivunumerolta
 */
const getPlacesWithin = (lat, lon, rad, page) => {
    const request = axios.get(`/liikuntapaikat?lat=${lat}&lon=${lon}&rad=${rad}&page=${page}`)
    return request.then(response => {
        console.log(response.status)
        return { data: response.data.places, status: response.status, count: response.data.count }
    })
}


/**
 * Palauttaa liikuntapaikkoja, jotka täsmäävät hakuun (logiikka täysin Lipaksen puolella)
 * @param {*} searchString Hakusanat
 * @returns Hakuun täsmäävät liikuntapaikat
 */
const searchPlaces = (searchString) => {
    const request = axios.get(`/liikuntapaikat?searchString=${encodeURIComponent(searchString)}`)
    return request.then(response => {
        console.log(response.status)
        return response.data.places //{ data: response.data.places, status: response.status, count: response.data.count }
    })
}


const exported =  { getTempStart, getAll, getPage, getPlacesWithin, searchPlaces }

export default exported