//import { Component } from 'react'
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet'
import React from 'react'
import Leaflet from 'leaflet'
import liikuntaService from '../services/liikuntapaikat'
import { getGeoJSON } from '../utils/extractLiikunta'

//Alustava kovakoodattu lat/lng kordinaatti Jyväskylän keskustaan
const jycenter = [62.241636, 25.746703]

//Luodaan kartalle oma komponenttinsa, joka sisältyy React-Leafletin MapContainerin sisälle, jos käytetään funktiomallista komponenttia niin voidaan poistaa.
/*class Mapcomponent extends Component {
    render() {
        return (
            <MapContainer
                className='rlmap'
                id='mainmap'
                //Keskitetään kartta
                center={jycenter}
                zoom={10}
                //Voiko hiirellä zoomata kartalla
                scrollWheelZoom={true}
            >
                <ExampleEventComponent />
                <GeojsonOnStart />
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        )
    }
}*/

//Funktiomuotoinen komponentti, hookkien käyttöön parempi.
const Mapcomponent = (props) => {
    return (
        <MapContainer
            className='rlmap'
            id='mainmap'
            //Keskitetään kartta
            center={jycenter}
            zoom={10}
            //Voiko hiirellä zoomata kartalla
            scrollWheelZoom={true}
        >
            <ExampleEventComponent mapBounds={props.mapBounds} onMapBoundsChange={props.onMapBoundsChange}/>
            <GeojsonOnStart />
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        </MapContainer>
    )
}

//Esimerkkikomponentti tapahtumille, tässä tapauksessa hiiren klikkaus kertoo klikatun pisteen kordinaatit
function ExampleEventComponent(props) {
    const map = useMapEvents({
        click: (e) => {
            var coords = e.latlng
            //console.log(coords)
            console.log('Klikattu piste: ' + JSON.stringify(coords))
        },
        //Zoomatessa kertoo kartan nykyiset rajat, voidaan käyttää esim. liikuntapaikkoja piirrettäessä.
        zoom: () => {
            var boundcoords = map.getBounds()
            //console.log('Zoomattu alue: ' + JSON.stringify(boundcoords))
            props.onMapBoundsChange(boundcoords)
            console.log(props.mapBounds)
        }
    })
    return null
}

//Geojsonin piirtämisen testaukseen heti kartan alustuessa, tällä hetkellä App.js mapBounds-päivittäminen ajaa tämänkin uudestaan.
function GeojsonOnStart() {
    //Testaukseen pisteiden piirtämiseksi
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: '#ff7800',
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }

    const map = useMap()

    //Haetaan esimerkissä liikuntaServicestä saatavat datat
    liikuntaService
        .getAll()
        .then(res => {
            res.forEach( geojsonelement => {
                //Luodaan extractLiikunta.js:n tarjoamalla funktiolla geojson-tyyppinen muuttuja
                var geo = getGeoJSON(geojsonelement)
                //Alustavana esimerkkinä, jos tyyppinä on piste, luodaan sille circlemarker
                if(geojsonelement.location.geometries.features[0].geometry.type === 'Point') {
                    var geopoint = Leaflet.geoJSON(geo, {
                        pointToLayer: function (feature, latlng) {
                            return Leaflet.circleMarker(latlng, geojsonMarkerOptions)
                        }
                    })
                    //Voidaan lisätä esim. tooltip tässä vaiheessa
                    geopoint.bindTooltip(geojsonelement.name)
                    geopoint.addTo(map)
                }
                //Muut kuin pisteet piirretään suoraan karttaan
                else {
                    var geoarea = Leaflet.geoJSON(geo)
                    geoarea.bindTooltip(geojsonelement.name)
                    geoarea.addTo(map)
                }
            })
        })
    return null
}


export default Mapcomponent