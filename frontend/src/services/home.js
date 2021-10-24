import axios from 'axios'

//Tämän nimistä serviceä ei varmaan tule olemaan. Pelkkä esimerkki; voi poistaa kun haluaa. -T

const getAll = () => {
    const request = axios.get('/api')
    return request.then(response => response.data)
}

const exported =  { getAll }

export default exported