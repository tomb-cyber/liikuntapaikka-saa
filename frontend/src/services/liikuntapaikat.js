import axios from 'axios'

const getAll = () => {
    const request = axios.get('/liikuntapaikat')
    return request.then(response => response.data)
}


const exported =  { getAll }

export default exported