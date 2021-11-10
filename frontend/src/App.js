import './App.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/images/marker-icon.png'
import React, { useEffect, useState } from 'react'
import liikuntaService from './services/liikuntapaikat'
import Sidebar from './components/Sidebar'
import { getGeoJSON } from './utils/extractLiikunta'
import Mapcomponent from './components/Mapcomponent'
import { WIDE_SCREEN_THRESHOLD, SIDEBAR_WIDTH } from './constants'

const App = () => {

    const [data, setData] = useState([])

    // Ikkunan leveys kuunteluun sidebaria varten.
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    useEffect(() => window.addEventListener('resize', () => setWindowWidth(window.innerWidth)), [])

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

    console.log(data)

    return (
        <div>
            <div id='sidebar-container' className='bg-light'>
                <Sidebar windowWidth={windowWidth} />
            </div>
            <div
                id='map-container'
                className='w-100 h-100 bg-info'
                // levealla ruudulla paddingia, ettei karttaa piirry sidebarin alle piiloon
                style={ WIDE_SCREEN_THRESHOLD <= windowWidth ? ({ paddingLeft: SIDEBAR_WIDTH }) : ({  })} >
                <Mapcomponent />
            </div>
        </div>
    )
}

export default App
