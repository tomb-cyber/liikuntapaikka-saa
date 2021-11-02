import { Component } from 'react'
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import React from 'react'

//Alustava kovakoodattu lat/lng kordinaatti Jyväskylän keskustaan
const jycenter = [62.241636, 25.746703]

//Luodaan kartalle oma komponenttinsa, joka sisältyy React-Leafletin MapContainerin sisälle
class Mapcomponent extends Component {
    render() {
        return (
            <MapContainer
                className="mainmap"
                //Keskitetään kartta
                center={jycenter}
                zoom={10}
                //Voiko hiirellä zoomata kartalla
                scrollWheelZoom={true}
            >
                <ExampleEventComponent />
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
            console.log(JSON.stringify(coords))
        },
        //Zoomatessa kertoo kartan nykyiset rajat, voidaan käyttää esim. liikuntapaikkoja piirrettäessä.
        zoom: () => {
            var boundcoords = map.getBounds()
            console.log('Zoomattu alue: ' + JSON.stringify(boundcoords))
        }
    })
    return null
}


export default Mapcomponent