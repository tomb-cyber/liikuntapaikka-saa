import './App.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/images/marker-icon.png'
import '../node_modules/leaflet.markercluster/dist/MarkerCluster.css'
import '../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css'
import React, { useEffect, useState } from 'react'
import liikuntaService from './services/liikuntapaikat'
import Sidebar from './components/Sidebar'
import { getGeoJSON } from './utils/extractLiikunta'
import Mapcomponent from './components/Mapcomponent'
import { WIDE_SCREEN_THRESHOLD, SIDEBAR_WIDTH } from './constants'
import { boundsToCoordsNRad, drawGeoJsonOnMap } from './utils/mapGeoJsonFunctions'

const App = () => {

    const [data, setData] = useState([])
    const [mapBounds, setMapBounds] = useState()

    const [mainMap, setMainMap] = useState()

    // Ikkunan leveys kuunteluun sidebaria varten.
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    useEffect(() => window.addEventListener('resize', () => setWindowWidth(window.innerWidth)), [])

    // sidebarin vakertamista varten valiaikainen liikuntapaikkavarasto
    const [liikuntapaikat, setLiikuntapaikat] = useState([])
    useEffect(() => {
        liikuntaService
            .getTempStart()
            .then(res => setLiikuntapaikat(res))
    }, [])
    console.log('sidebarin lp-data: ', liikuntapaikat)

    // Turha demous hookki, saa poistaa kun tiellä
    useEffect(() => {
        liikuntaService
            .getTempStart()
            .then(res => {
                //console.log(res.map(each => getGeoJSON(each)))
                console.log(res)
                return setData(res.map(each => getGeoJSON(each)))
            })

    }, [])

    console.log('data', data)

    // funktio, jota kutsutaan kun liikuntapaikka aktivoidaan sidebarista kasin
    const handleVenueCardClick = (sportsPlaceId) => {
        console.log(`Sidebarissa klikattiin liikuntapaikkaa, id:${sportsPlaceId}`)
    }

    // TODO: tähän funktioon jos sais liikuntapaikan sportsPlaceId:n kartalla klikatessa
    const activateVenueCard = (sportsPlaceId) => {
        console.log(`Kartalla klikattiin liikuntapaikkaa, id: ${sportsPlaceId}`)
    }

    const updateBounds = (bounds) => {
        setMapBounds(bounds)
        const coords = boundsToCoordsNRad(bounds)
        //console.log(coords)
        liikuntaService
            .getPlacesWithin(coords.lat, coords.lon, coords.rad)
            .then(res => {
                //console.log(res.map(each => getGeoJSON(each)))
                console.log(res)
                /*var testi = []
                liikuntaService.getTempStart().then(respo => {
                    console.log(respo)
                    testi = respo.map(each => getGeoJSON(each))
                })
                console.log('piirretään!!!')*/
                var testi = res.map(each => getGeoJSON(each))
                drawGeoJsonOnMap(mainMap, testi)
                return setData(res.map(each => getGeoJSON(each)))
            })
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
                <Mapcomponent mapBounds={mapBounds} onMapBoundsChange={updateBounds} mapInUse={mainMap} setMapInUse={setMainMap} />
            </div>
        </div>
    )
}

export default App