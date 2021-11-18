import axios from 'axios'

const getTempStart = () => {
    const request = axios.get('/liikuntapaikat/')
    return request.then(response => {
        console.log(response.status)
        return response.data    //{ data: response.data, status: response.status }
    })
}


const getAll = () => {
    const request = axios.get('/liikuntapaikat')
    return request.then(response => {
        console.log(response.status)
        return response.data    //{ data: response.data, status: response.status }
    })
}


const getPage = (pageNumber) => {
    const request = axios.get('/liikuntapaikat?pageNumber=' + pageNumber)
    return request.then(response => {
        return response.data
    })
}


const getPlacesWithin = (lat, lon, rad) => {
    const request = axios.get(`/liikuntapaikat?lat=${lat}&lon=${lon}&rad=${rad}`)
    return request.then(response => {
        console.log(response.status)
        return response.data
    })
}

const exported =  { getTempStart, getAll, getPage, getPlacesWithin }

export default exported