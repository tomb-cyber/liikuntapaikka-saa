//import { Component } from 'react'
import { MapContainer, useMapEvents } from 'react-leaflet'
import React from 'react'
import Leaflet from 'leaflet'
//import { geoJsonOnStart } from '../utils/mapGeoJsonFunctions'

//Alustava kovakoodattu lat/lng kordinaatti Jyväskylän keskustaan
const jycenter = [62.241636, 25.746703]

var basetile = Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors', className: 'osmTileLayer' })

//Luodaan kartalle oma komponenttinsa, joka sisältyy React-Leafletin MapContainerin sisälle, jos käytetään funktiomallista komponenttia niin voidaan myöhemmin poistaa.
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
                <ExampleEventComponent updateCoords={this.props.updateCoords} />
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
            maxZoom={20}
            minZoom={6}
            //Voiko hiirellä zoomata kartalla
            scrollWheelZoom={true}
            whenCreated={(map) => {
                //geoJsonOnStart(map)
                map.addLayer(basetile)
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
            //console.log(coords)
            console.log('Klikattu piste: ' + JSON.stringify(coords))
        },
        //Zoomatessa kertoo kartan nykyiset rajat, voidaan käyttää esim. liikuntapaikkoja piirrettäessä.
        zoom: () => {
            var boundcoords = map.getBounds()
            //console.log('Zoomattu alue: ' + JSON.stringify(boundcoords))
            props.onMapBoundsChange(boundcoords)
            //console.log(props.mapBounds)
        }
    })
    return null
}

export default Mapcomponent