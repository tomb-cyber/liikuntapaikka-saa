import axios from 'axios'

const getAll = () => {
    const request = axios.get('/liikuntapaikat')
    return request.then(response => {
        console.log(response.status)
        return { data: response.data, status: response.status }
    })
}

const getPage = (pageNumber) => {
    const request = axios.get('/liikuntapaikat?pageNumber=' + pageNumber)
    return request.then(response => {
        console.log(response.status)
        return { data: response.data, status: response.status }
    })}


const exported =  { getAll, getPage }

export default exported