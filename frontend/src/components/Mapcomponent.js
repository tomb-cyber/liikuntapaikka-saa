//import { Component } from 'react'
import { MapContainer, useMapEvents } from 'react-leaflet'
import React from 'react'
import L from 'leaflet'
import '../../node_modules/leaflet.markercluster/dist/leaflet.markercluster'
//import { geoJsonOnStart } from '../utils/mapGeoJsonFunctions'

//Alustava kovakoodattu lat/lng kordinaatti Jyväskylän keskustaan
const jycenter = [62.241636, 25.746703]

//Rajat kartalle
var swcorner = L.latLng(59.59692577787735, 19.440307617187504)
var necorner = L.latLng(70.20743570670635, 31.267089843750004)
const mapmaxbounds = L.latLngBounds(swcorner, necorner)

//TileLayer
var basetile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors', className: 'osmTileLayer' })

//MarkerClusterGroup-optionit
var mcgoptions = {}
mcgoptions.nameId = 'markercg'

//Klusteroitavia objekteja varten, annetaan hookin kautta App.js:lle asti
var markerLG = L.markerClusterGroup(mcgoptions)

var lineStringLG = L.layerGroup()


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
            minZoom={6}
            maxBounds={mapmaxbounds}
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