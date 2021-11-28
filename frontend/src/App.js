import './App.css'
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/images/marker-icon.png'
import '../node_modules/leaflet.markercluster/dist/MarkerCluster.css'
import '../node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css'
import React, { useEffect, useState } from 'react'
import liikuntaService from './services/liikuntapaikat'
import Sidebar from './components/Sidebar'
import Mapcomponent from './components/Mapcomponent'
import { WIDE_SCREEN_THRESHOLD, SIDEBAR_WIDTH } from './constants'
import { boundsToCoordsNRad, drawGeoJsonOnMap, moveWhenSidebarClicked } from './utils/mapGeoJsonFunctions'
//import saaService from './services/saatiedot'

const App = () => {

    const aloitusBounds = {
        _southWest: {
            lat: 62.19663677298255,
            lng: 25.628828030200676
        },
        _northEast: {
            lat: 62.29213944722225,
            lng: 25.9542980009038
        }
    }

    //saaService.haeSaa('62.19663677298255,25.628828030200676', (input => console.log(input.locations[0].info.name)))

    const [data, setData] = useState([])
    const [mapBounds, setMapBounds] = useState(aloitusBounds)

    const [mainMap, setMainMap] = useState()
    const [isMapCreated, setMapCreated] = useState(false)
    const [markerLayerGroup, setMarkerLayerGroup] = useState()
    const [lineStringLG, setLineStringLG] = useState()

    const [status, setStatus] = useState(206)
    const [page, setPage] = useState(1)

    // Ikkunan leveys kuunteluun sidebaria varten.
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)
    useEffect(() => window.addEventListener('resize', () => setWindowWidth(window.innerWidth)), [])

    useEffect(() => {
        fetchWithBounds(mapBounds, 1)
    }, [])


    /**
     * Haku looppi. Laukeaa, kun page päivittyy ja toistaa hakua kunnes kaikki data ollaan saatu
     * (; olettaen, ettei fetchWithBoundsin sisällä threshold ylity)
     */
    useEffect(() => {
        if (status === 206) {
            fetchWithBounds(mapBounds, page)
            //console.log('newPage: ', page)
        }
    }, [page])

    console.log('data', data)

    const handleSearchSubmit = (hakusana) => {
        console.log(`tehtiin haku ${hakusana}`)
    }

    // funktio, jota kutsutaan kun liikuntapaikka aktivoidaan sidebarista kasin
    const handleVenueCardClick = (sportsPlaceId) => {
        console.log(`Sidebarissa klikattiin liikuntapaikkaa, id:${sportsPlaceId}`)
        //Liikkuu kartalla liikuntapaikalle
        moveWhenSidebarClicked(sportsPlaceId, data, mainMap)
    }

    // TODO: tähän funktioon jos sais liikuntapaikan sportsPlaceId:n kartalla klikatessa
    const handleMapMarkerClick = (sportsPlaceId) => {
        console.log(`Kartalla klikattiin liikuntapaikkaa, id: ${sportsPlaceId}`)
    }


    /**
     * Asettaa taulukon liikuntapaikat datan jatkoksi, jos ei jo datassa.
     * @param newData Taulukko liikuntapaikkoja
     */
    const updateData = (newData, callback) => {
        const filtered = []
        let isFound
        for (let i = 0; i < newData.length; i++) {
            isFound = false
            for (let j = 0; j < data.length; j++) {
                if (newData[i].sportsPlaceId === data[j].sportsPlaceId) {
                    isFound = true
                    break
                }
            }
            if (!isFound) {
                filtered.push(newData[i])
            }
        }
        //console.log('Uudet: ', filtered)
        setData(data.concat(filtered), callback)
        return filtered
    }

    /**
     * Zoomin eventille tarkoitettu funktio. Päivittää uuden mapBounds ja tekee liikuntapaikka haun
     * @param bounds Kartan bounds
     */
    const updateBounds = (bounds) => {
        setMapBounds(bounds)    // Kuinkahan vaikeaa olisi tehdä päivitys vain silloin, jos uusi bounds EI ole aikasemman sisällä
        fetchWithBounds(bounds, 1)
    }


    /**
     * Hakee backendilta bounds sisällä olevat liikuntapaikat sivulta page. Jos kartan alueella on vähemmän paikkoja kuin threshold
     * sallii, vaihdetaan page state, joka laukaisee loopin useEffectin avulla, millä haetaan kaikki alueen paikat.
     * @param bounds Kartan bounds
     * @param page Haun sivunumero. APIsta saa max 100 liikuntapaikkaa kerralla, joten pilkkoontuu useisiin sivuihin.
     */
    const fetchWithBounds = (bounds, page) => {
        const threshold = 800
        const coords = boundsToCoordsNRad(bounds)
        liikuntaService
            .getPlacesWithin(coords.lat, coords.lon, coords.rad, page)
            .then(res => {
                page++
                setStatus(res.status)
                var updated = updateData(res.data)//.map(each => getGeoJSON(each)))

                //Jos päivityksiä tapahtuu ja kartta on jo olemassa niin silloin lisätään päivitykset, jos karttaa ei oltu vielä luotu lisätään kaikki data
                if(updated !== undefined) {
                    if(mainMap !== undefined && isMapCreated === true) {
                        drawGeoJsonOnMap(updated, markerLayerGroup, mainMap, handleMapMarkerClick) //lineStringLG
                    }
                    if(mainMap !== undefined && isMapCreated === false) {
                        drawGeoJsonOnMap(data, markerLayerGroup, mainMap, handleMapMarkerClick)
                        setMapCreated(true)
                    }
                }

                if (res.count < threshold)
                    setPage(page)
            })
    }


    return (
        <div>
            <div>
                <Sidebar
                    windowWidth={windowWidth}
                    liikuntapaikat={data}
                    handleVCC={handleVenueCardClick}
                    handleSearchSubmit={handleSearchSubmit}
                    extensionFunc={(id) => liikuntaService.getById(id)} />
            </div>
            <div
                className='w-100 h-100 bg-info'
                // levealla ruudulla paddingia, ettei karttaa piirry sidebarin alle piiloon
                style={ WIDE_SCREEN_THRESHOLD <= windowWidth ? ({ paddingLeft: SIDEBAR_WIDTH }) : ({  })} >
                <Mapcomponent mapBounds={mapBounds} onMapBoundsChange={updateBounds}
                    mapInUse={mainMap} setMapInUse={setMainMap}
                    markerLG={markerLayerGroup} setMarkerLG={setMarkerLayerGroup}
                    lineStringLG={lineStringLG} setLineStringLG={setLineStringLG}
                />
            </div>
        </div>
    )
}

export default App