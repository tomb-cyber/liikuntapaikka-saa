import Leaflet from 'leaflet'
import markerIcon from '../../node_modules/leaflet/dist/images/marker-icon.png'
import markerIconShadow from '../../node_modules/leaflet/dist/images/marker-shadow.png'
import '../../node_modules/leaflet.markercluster/dist/leaflet.markercluster'
import liikuntaService from '../services/liikuntapaikat'
import { getGeoJSON } from './extractLiikunta'
import { getDistance } from 'geolib'

//Geojsonin piirtämisen testaukseen heti kartan alustuessa.
function geoJsonOnStart(map) {
    //Testaukseen pisteiden piirtämiseksi, ei tällä hetkellä käytössä
    /*var geojsonMarkerOptions = {
        radius: 8,
        fillColor: '#ff7800',
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }*/

    //Default-markeria varten
    var defaultIcon = Leaflet.icon( {
        iconUrl: markerIcon,
        shadowUrl: markerIconShadow
    } )

    Leaflet.Marker.prototype.options.icon = defaultIcon

    //Polylinien klusteroinniksi asetetaan alusta keskuskohta
    Leaflet.Polyline.addInitHook(function () {
        this._latlng = this._bounds.getCenter()
    })

    Leaflet.Polyline.include({
        getLatLng: function () {
            return this._latlng
        },
        setLatLng: function () {}
    })

    var markerLG = Leaflet.markerClusterGroup()

    var geoJsonArray = new Array()

    //Haetaan esimerkissä liikuntaServicestä saatavat datat
    liikuntaService
        .getTempStart() // Vaihda tämä getAll(), niin tulee kaikki paikat, getTempStart() jos haluaa aiemman pienen määrän
        .then(res => {  // (menee hetki, sillä se lataa ne backendissä ja lähettää fronttiin kerralla)
            res.forEach( geojsonelement => {
                //Luodaan extractLiikunta.js:n tarjoamalla funktiolla geojson-tyyppinen muuttuja
                var geo = getGeoJSON(geojsonelement)
                console.log(geo)
                //Alustavana esimerkkinä, jos tyyppinä on piste, luodaan sille circlemarker
                if(geo.type === 'Point') {
                    var geopoint = Leaflet.marker([geo.coordinates[1], geo.coordinates[0]])
                    //Voidaan lisätä esim. tooltip tässä vaiheessa
                    geopoint.bindTooltip(geojsonelement.name)
                    markerLG.addLayer(geopoint)
                }
                //Muut kuin pisteet piirretään suoraan karttaan
                else {
                    geoJsonArray.push(geo)
                }
            })
            map.addLayer(markerLG)

            var geoJsonLayer = Leaflet.geoJson(geoJsonArray)
            markerLG.addLayer(geoJsonLayer)
        })
    return null
}

/**Funktio piirtää annetut GeoJSONit karttaan
 *
 * @param {*} givenMap Kartta, jolle GeoJSONit halutaan piirtää
 * @param {*} geoJsonArray Taulukko GeoJSON-muodossa olevia objekteja
 * @returns nullin, muutokset karttaan tapahtuvat funktion suorituksen aikana
 */
function drawGeoJsonOnMap(givenMap, givenGeoJsonArray) {
    //Default-markeria varten
    var defaultIcon = Leaflet.icon( {
        iconUrl: markerIcon,
        shadowUrl: markerIconShadow
    } )

    Leaflet.Marker.prototype.options.icon = defaultIcon

    //Polylinien klusteroinniksi asetetaan keskuskohta
    Leaflet.Polyline.addInitHook(function () {
        this._latlng = this.getBounds().getCenter()
    })

    Leaflet.Polyline.include({
        getLatLng: function () {
            return this._latlng
        },
        setLatLng: function () {}
    })

    /*givenMap.eachLayer((layer) => {
        if(layer.className !== 'osmTileLayer')
        givenMap.removeLayer(layer)
    })*/

    var markerLG = Leaflet.markerClusterGroup()

    var geoJsonArray2 = new Array()

    //Oletettu että sisään tuleva taulukko on jo GeoJSON-muodossa
    givenGeoJsonArray.forEach(geoJson => {
        if(geoJson.type === 'Point') {
            var geopoint = Leaflet.marker([geoJson.coordinates[1], geoJson.coordinates[0]])
            //Voidaan lisätä esim. tooltip tässä vaiheessa
            markerLG.addLayer(geopoint)
        }
        //Muut kuin pisteet piirretään suoraan karttaan, vain polygonit toimivat tällä hetkellä
        else {
            geoJsonArray2.push(geoJson)
        }
        givenMap.addLayer(markerLG)

        var geoJsonLayer = Leaflet.geoJson(geoJsonArray2)
        markerLG.addLayer(geoJsonLayer)
    })
    return null
}

/**
 * Muutetaan bounds pisteeksi ja säteeksi.
 * @param bounds Kartan bounds, sisältää southWest ja northEast koordinaatit
 * @returns Bounds keskikohta ja säde keskikohdasta kulmiin
 */
const boundsToCoordsNRad = (bounds) => {
    const midLat = bounds._southWest.lat + (bounds._northEast.lat - bounds._southWest.lat)/2
    const midLon = bounds._southWest.lng + (bounds._northEast.lng - bounds._southWest.lng)/2
    const rad = getDistance(
        { latitude: bounds._southWest.lat, longitude: bounds._southWest.lng },
        { latitude: bounds._northEast.lat, longitude: bounds._northEast.lng })/2

    return { lat: midLat, lon: midLon, rad: rad/1000 }
}


export { geoJsonOnStart, drawGeoJsonOnMap, boundsToCoordsNRad }