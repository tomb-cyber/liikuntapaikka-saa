import './App.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/images/marker-icon.png'
import React, { useEffect, useState } from 'react'
import liikuntaService from './services/liikuntapaikat'
import Sidebar from './components/Sidebar'
import { getGeoJSON, getPage } from './utils/extractLiikunta'
import Mapcomponent from './components/Mapcomponent'
import { WIDE_SCREEN_THRESHOLD, SIDEBAR_WIDTH } from './constants'

const App = () => {

    const [data, setData] = useState([])
    const [mapBounds, setMapBounds] = useState()

    // Ikkunan leveys kuunteluun sidebaria varten.
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    useEffect(() => window.addEventListener('resize', () => setWindowWidth(window.innerWidth)), [])

    // sidebarin vakertamista varten valiaikainen liikuntapaikkavarasto
    const [liikuntapaikat, setLiikuntapaikat] = useState([])
    useEffect(() => {
        liikuntaService
            .getAll()
            .then(res => setLiikuntapaikat(res))
    }, [])
    console.log('sidebarin lp-data: ', liikuntapaikat)

    // Turha demous hookki, saa poistaa kun tiellä
    useEffect(() => {
        let pageNum = 0
        let newFusion = []
        let status

        let requestData = () => {
            pageNum += 1
            liikuntaService
                //.getAll()
                .getPage(pageNum)
                .then(res => {
                    status = res.status
                    newFusion = newFusion.concat(res.data)
                }).then(() => {
                    if (status === 206) {
                        requestData()
                    }
                    else {
                        setData(newFusion)
                        setTimeout(console.log(data), 3000)
                    }
                })
            console.log(status === 206)
        }
        requestData()
    }, [])

    console.log('data', data)

    // funktio, jota kutsutaan kun liikuntapaikka aktivoidaan sidebarista kasin
    const handleVenueCardClick = (sportsPlaceId) => {
        console.log(`Sidebarissa klikattiin liikuntapaikkaa, id:${sportsPlaceId}`)
    }


    return (
        <div>
            <div>
                <Sidebar windowWidth={windowWidth} liikuntapaikat={liikuntapaikat} handleVCC={handleVenueCardClick} />
            </div>
            <div
                className='w-100 h-100 bg-info'
                // levealla ruudulla paddingia, ettei karttaa piirry sidebarin alle piiloon
                style={ WIDE_SCREEN_THRESHOLD <= windowWidth ? ({ paddingLeft: SIDEBAR_WIDTH }) : ({  })} >
                <Mapcomponent mapBounds={mapBounds} onMapBoundsChange={setMapBounds} />
            </div>
        </div>
    )
}

export default App
