import axios from 'axios'

const getTempStart = () => {
    const request = axios.get('/liikuntapaikat/')
    return request.then(response => {
        console.log(response.status)
        return response.data.places    //{ data: response.data, status: response.status }
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
    const request = axios.get('/liikuntapaikat?page=' + pageNumber)
    return request.then(response => {
        return response.data
    })
}


const getPlacesWithin = (lat, lon, rad, page) => {
    const request = axios.get(`/liikuntapaikat?lat=${lat}&lon=${lon}&rad=${rad}&page=${page}`)
    return request.then(response => {
        console.log(response.status)
        return { data: response.data.places, status: response.status, count: response.data.count }
    })
}

const exported =  { getTempStart, getAll, getPage, getPlacesWithin }

export default exported