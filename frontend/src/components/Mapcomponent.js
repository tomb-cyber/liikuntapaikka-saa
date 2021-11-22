//import { Component } from 'react'
import { MapContainer, useMapEvents } from 'react-leaflet'
import React from 'react'
import Leaflet from 'leaflet'
import '../../node_modules/leaflet.markercluster/dist/leaflet.markercluster'
//import { geoJsonOnStart } from '../utils/mapGeoJsonFunctions'

//Alustava kovakoodattu lat/lng kordinaatti Jyväskylän keskustaan
const jycenter = [62.241636, 25.746703]

//TileLayer
var basetile = Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors', className: 'osmTileLayer' })

//Klusteroitavia objekteja varten, annetaan hookin kautta App.js:lle asti
var markerLG = Leaflet.markerClusterGroup()

var lineStringLG = Leaflet.layerGroup()


//Funktiomuotoinen komponentti, hookkien käyttöön parempi.
const Mapcomponent = (props) => {
    return (
        <MapContainer
            className='rlmap'
            id='mainmap'
            //Keskitetään kartta
            center={jycenter}
            zoom={10}
            maxZoom={17}
            minZoom={5}
            //Voiko hiirellä zoomata kartalla
            scrollWheelZoom={true}
            whenCreated={(map) => {
                //geoJsonOnStart(map)
                map.addLayer(basetile)
                map.addLayer(markerLG)
                //map.addLayer(lineStringLG)
                props.setMarkerLG(markerLG)
                props.setLineStringLG(lineStringLG)
                props.setMapInUse(map)
            }}
        >
            <ExampleEventComponent mapBounds={props.mapBounds} onMapBoundsChange={props.onMapBoundsChange}/>
        </MapContainer>
    )
}


//Esimerkkikomponentti tapahtumille, tässä tapauksessa hiiren klikkaus kertoo klikatun pisteen kordinaatit
function ExampleEventComponent(props) {
    const map = useMapEvents({
        click: (e) => {
            var coords = e.latlng
            console.log('Klikattu piste: ' + JSON.stringify(coords))
        },
        //Zoomatessa kertoo kartan nykyiset rajat, voidaan käyttää esim. liikuntapaikkoja piirrettäessä.
        zoom: () => {
            props.onMapBoundsChange(map.getBounds())
            //LineString-testauksiin
            /*if(map.getZoom() >= 14 && !map.hasLayer(lineStringLG)) {
                map.addLayer(lineStringLG)
            }
            if(map.getZoom() <= 13 && map.hasLayer(lineStringLG)){
                map.removeLayer(lineStringLG)
            }*/
        },
        moveend: () => {
            props.onMapBoundsChange(map.getBounds())
        }
    })
    return null
}

export default Mapcomponent