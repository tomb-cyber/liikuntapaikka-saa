import Leaflet from 'leaflet'
import liikuntaService from '../services/liikuntapaikat'
import { getGeoJSON } from './extractLiikunta'

//Geojsonin piirtämisen testaukseen heti kartan alustuessa.
function geoJsonOnStart(map) {
    //Testaukseen pisteiden piirtämiseksi
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: '#ff7800',
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }
    //Haetaan esimerkissä liikuntaServicestä saatavat datat
    liikuntaService
        .getAll()
        .then(res => {
            res.forEach( geojsonelement => {
                //Luodaan extractLiikunta.js:n tarjoamalla funktiolla geojson-tyyppinen muuttuja
                var geo = getGeoJSON(geojsonelement)
                //Alustavana esimerkkinä, jos tyyppinä on piste, luodaan sille circlemarker
                if(geo.type === 'Point') {
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

export { geoJsonOnStart }