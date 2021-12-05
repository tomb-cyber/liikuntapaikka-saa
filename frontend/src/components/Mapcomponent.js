//import { Component } from 'react'
import { MapContainer, useMapEvents } from 'react-leaflet'
import React from 'react'
import L from 'leaflet'
import '../../node_modules/leaflet.markercluster/dist/leaflet.markercluster'

import '@geoman-io/leaflet-geoman-free'
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css'
import markerIcon from '../../node_modules/leaflet/dist/images/marker-icon.png'
import markerIconShadow from '../../node_modules/leaflet/dist/images/marker-shadow.png'
import '../App.css'


//import { geoJsonOnStart } from '../utils/mapGeoJsonFunctions'

//Alustava kovakoodattu lat/lng kordinaatti Jyväskylän keskustaan
const jycenter = [62.241636, 25.746703]

//Rajat kartalle
var swcorner = L.latLng(59.0, 16.0)
var necorner = L.latLng(71., 37.0)
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
            //Voiko hiirellä zoomata kartalla
            scrollWheelZoom={true}
            maxBounds={mapmaxbounds}
            whenCreated={(map) => {
                //geoJsonOnStart(map)

                map.addLayer(basetile)
                map.addLayer(markerLG)
                map.addLayer(lineStringLG)

                props.setMarkerLG(markerLG)
                props.setLineStringLG(lineStringLG)
                props.setMapInUse(map)



                // Piirtojuttuja. Marker kuvan default haku hajoaa, joten pakotetaan options uudestaan
                const customIcon = L.icon({
                    iconUrl: markerIcon,
                    shadowUrl: markerIconShadow,
                    className: 'drawnMarker', // Löytyy App.css
                    iconAnchor:   [12, 41],
                    popupAnchor:  [0, -41]
                })

                const options = {
                    markerStyle: {
                        //draggable: true,
                        icon: customIcon
                    }
                }

                map.pm.setGlobalOptions(options)

                // Pystyy liikuttamaan tai poistamaan Lipas paikkoja. TODO: pystyy muokkaamaan vain itse lisättyjä
                map.pm.addControls({
                    position: 'topright',
                    drawCircle: false,
                    drawCircleMarker: false,
                    //dragMode: false
                })

                // Eventhandlereitä
                // map.on('pm:drawstart', (e) => {
                //     console.log(e)
                //     console.log(e.workingLayer._leaflet_id)
                // })

                const form = '<form id="testform" class="grid-container">' +
                                '<div class="grid-item">' +
                                '<label  for="name">Liikuntapaikan nimi: </label>' +
                                '<input type="text" id="name" />' +
                                '</div>' +
                                '<div class="grid-item">' +
                                '<label  for="osoite" >Osoite: </label>' +
                                '<input type="text" id="osoite"/>' +
                                '</div>' +
                                '<div class="grid-item">' +
                                '<input type="submit" value="Tallenna" ></input>' +
                                '</div>' +
                            '</form>'


                map.on('pm:create', (event) => {
                    const id = event.marker._leaflet_id
                    const latlon = event.marker._latlng
                    console.log(event)
                    console.log(id, latlon)
                    // Popupin sisälle pitäis laittaa formi, että voi tallentaa dataan
                    event.marker.bindPopup(form)

                    event.layer.on('popupopen', e => {
                        const formElem = e.popup._wrapper.firstChild.firstChild
                        console.log(formElem)
                        formElem.onsubmit = (e) => {
                            e.preventDefault()
                            console.log('ei refreshaa')
                        }
                    })

                    //'leafletId: ' + id + ', latlon: ' + JSON.stringify(latlon))  // kaikki liikuttaminen jne. rikkoo
                })
                // map.on('pm:drawend', (e) => {
                //     console.log(e)
                // })
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
        zoomend: () => {
            props.onMapBoundsChange(map.getBounds())
            //LineString-testauksiin
            if(map.getZoom() >= 14 && !map.hasLayer(lineStringLG)) {
                map.addLayer(lineStringLG)
            }
            if(map.getZoom() <= 13 && map.hasLayer(lineStringLG)){
                map.removeLayer(lineStringLG)
            }
        },
        moveend: () => {
            props.onMapBoundsChange(map.getBounds())
        }
    })
    return null
}

export default Mapcomponent