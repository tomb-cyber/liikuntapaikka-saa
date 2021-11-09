import { Component } from 'react'
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet'
import React from 'react'
import Leaflet from 'leaflet'
import liikuntaService from '../services/liikuntapaikat'
import { getGeoJSON } from '../utils/extractLiikunta'

//Alustava kovakoodattu lat/lng kordinaatti Jyväskylän keskustaan
const jycenter = [62.241636, 25.746703]

//Luodaan kartalle oma komponenttinsa, joka sisältyy React-Leafletin MapContainerin sisälle
class Mapcomponent extends Component {
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
}

//Esimerkkikomponentti tapahtumille, tässä tapauksessa hiiren klikkaus kertoo klikatun pisteen kordinaatit
function ExampleEventComponent() {
    const map = useMapEvents({
        click: (e) => {
            var coords = e.latlng
            //console.log(coords)
            console.log('Klikattu piste: ' + JSON.stringify(coords))
        },
        //Zoomatessa kertoo kartan nykyiset rajat, voidaan käyttää esim. liikuntapaikkoja piirrettäessä.
        zoom: () => {
            var boundcoords = map.getBounds()
            console.log('Zoomattu alue: ' + JSON.stringify(boundcoords))
        }
    })
    return null
}

//Geojsonin piirtämisen testaukseen heti kartan alustuessa
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
                    Leaflet.geoJSON(geo, {
                        pointToLayer: function (feature, latlng) {
                            return Leaflet.circleMarker(latlng, geojsonMarkerOptions)
                        }
                    }).addTo(map)
                }
                //Muut kuin pisteet piirretään suoraan karttaan
                else Leaflet.geoJSON(geo).addTo(map)
                //console.log('Ollaan lisäämässä: ' + JSON.stringify(geo))
            })
        })
    return null
}


export default Mapcomponent