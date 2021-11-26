﻿import Leaflet from 'leaflet'
import markerIcon from '../../node_modules/leaflet/dist/images/marker-icon.png'
import markerIconShadow from '../../node_modules/leaflet/dist/images/marker-shadow.png'
import '../../node_modules/leaflet.markercluster/dist/leaflet.markercluster'
//import liikuntaService from '../services/liikuntapaikat'
import { getGeoJSON } from './extractLiikunta'
import { getDistance } from 'geolib'

/*
//Geojsonin piirtämisen testaukseen heti kartan alustuessa. Poistetaan melko varmasti.
function geoJsonOnStart(map) {
    //Testaukseen pisteiden piirtämiseksi, ei tällä hetkellä käytössä
    var geojsonMarkerOptions = {
        radius: 8,
        fillColor: '#ff7800',
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    }

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
}*/

/**Funktio piirtää annetut GeoJSONit karttaan
 *
 * @param {*} givenGeoJsonArray Taulukko GeoJSON-muodossa olevia objekteja
 * @param {*} givenMarkerLayerGroup markerLayerGroup, jolle GeoJSON-oliot piirretään
 * //givenLineStringLayerGroup -testauksessa, ei tällä hetkellä mukana
 * @returns nullin, muutokset karttaan tapahtuvat funktion suorituksen aikana
 */
function drawGeoJsonOnMap(givenGeoJsonArray, givenMarkerLayerGroup, givenMap) {
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

    // Väänsin tähän tämmösen, että jos ei alussa oo mitään layergroup. Vaihda jos aiheuttaa ongelmia -T
    let newLayerGroup = givenMarkerLayerGroup !== undefined ? givenMarkerLayerGroup : Leaflet.markerClusterGroup(null)

    //Jos givenMarkerLayerGroupia ei ole vielä olemassa pitää newLayerGroup lisätä karttaan mukaan
    var isGivenMLG = true
    if(givenMarkerLayerGroup === undefined) {
        isGivenMLG = false
    }

    //Tyhjennetään aiempi LayerGroup, annettu funktiolle kutsuttaessa
    //newLayerGroup.clearLayers()

    //Esim. Polygonien piirtämistä varten
    var geoJsonDrawArray = new Array()

    //Tooltipin ja muidenkin ominaisuuksien lisääminen geoJsonLayerin kaikkiin yksilöihin
    function onEachFeature(feature, layer) {
        if(feature.geometry.type === 'Polygon') {
            layer.bindTooltip(feature.properties.name)
        }
    }

    //Oletettu että sisään tuleva taulukko on jo GeoJSON-muodossa
    givenGeoJsonArray.forEach(dataelement => {
        var geojson = getGeoJSON(dataelement)
        if(geojson.type === 'Point') {
            var geopoint = Leaflet.marker([geojson.coordinates[1], geojson.coordinates[0]])
            //Voidaan lisätä esim. tooltip tässä vaiheessa
            geopoint.bindTooltip(dataelement.name)
            newLayerGroup.addLayer(geopoint)
        }
        //Muut kuin pisteet piirretään suoraan karttaan, vain polygonit toimivat tällä hetkellä
        //Testausta varten luotu laajempaa GeoJSON-oliota
        else if(geojson.type === 'Polygon') {
            //console.log(geojson)
            var geoarea = {
                'type': 'Feature',
                'properties': {
                    'name': dataelement.name,
                    'sportsPlaceId': dataelement.sportsPlaceId
                },
                'geometry': geojson
            }
            geoJsonDrawArray.push(geoarea)
        }
        else {
            console.log(dataelement)
            console.log(geojson)
            //Myöhemmin esim. LineStringit
            /*var geoline = Leaflet.geoJSON(geojson)
            givenLineStringLayerGroup.addLayer(geoline)*/

            if(geojson[0].type === 'LineString') {
                var geolinepoint = Leaflet.marker([geojson[0].coordinates[0][1], geojson[0].coordinates[0][0]])
                geolinepoint.bindTooltip(dataelement.name + ' (Reitti)')
                newLayerGroup.addLayer(geolinepoint)
            }
        }
    })

    //Jos käytetään alussa newLayerGrouppia, niin lisätään se karttaan mukaan
    if(!isGivenMLG) givenMap.addLayer(newLayerGroup)
    //Luodaan poly-olioista Leafletin geoJson-taulukko ja lisätään haluttuun LayerGrouppiin
    var geoJsonLayer = Leaflet.geoJSON(geoJsonDrawArray, {
        onEachFeature: onEachFeature
    })
    newLayerGroup.addLayer(geoJsonLayer)
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


export { drawGeoJsonOnMap, boundsToCoordsNRad }