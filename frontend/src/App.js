import './App.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/images/marker-icon.png'
import React, { useEffect, useState } from 'react'
import liikuntaService from './services/liikuntapaikat'
import Sidebar from './components/Sidebar'
import { getGeoJSON } from './utils/extractLiikunta'
import Mapcomponent from './components/Mapcomponent'

const App = () => {

    const [data, setData] = useState([])

    // Turha demous hookki, saa poistaa kun tiellä
    useEffect(() => {
        liikuntaService
            .getAll()
            .then(res => {
                //console.log(res.map(each => getGeoJSON(each)))
                console.log(res)
                return setData(res.map(each => getGeoJSON(each)))
            })

    }, [])

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div id='sidebar' className='bg-light'>
                    <Sidebar />
                </div>
                <div className='col bg-info'>
                    <Mapcomponent />
                    { data.map(i => JSON.stringify(i) + ' ')
                    }
                </div>
            </div>
        </div>
    )
}

export default App
