import L from 'leaflet'
import markerIcon from '../../node_modules/leaflet/dist/images/marker-icon.png'
import markerIconShadow from '../../node_modules/leaflet/dist/images/marker-shadow.png'
import '../../node_modules/leaflet.markercluster/dist/leaflet.markercluster'
import { getGeoJSON } from './extractLiikunta'
import { getDistance } from 'geolib'

/**Funktio piirtää annetut GeoJSONit karttaan
 *
 * @param {*} givenGeoJsonArray Taulukko GeoJSON-muodossa olevia objekteja
 * @param {*} givenMarkerLayerGroup markerLayerGroup, jolle GeoJSON-oliot piirretään
 * @param {*} givenMap kartta, jota käsitellään
 * @param {*} handleMarkerClick sportsPlaceId:n antamista varten
 * @param {*} givenLineStringLayerGroup LayerGroup linestring-objekteja varten, nämä näytetään kartalla vasta kun tarvittava zoomlevel on saavutettu
 * @returns null, muutokset karttaan tapahtuvat funktion suorituksen aikana
 */
function drawGeoJsonOnMap(givenGeoJsonArray, givenMarkerLayerGroup, givenMap, handleMarkerClick, givenLineStringLayerGroup) {
    //Default-markeria varten
    var defaultIcon = L.icon( {
        iconUrl: markerIcon,
        shadowUrl: markerIconShadow
    } )

    L.Marker.prototype.options.icon = defaultIcon

    //Polylinien klusteroinniksi asetetaan keskuskohta
    L.Polyline.addInitHook(function () {
        //console.log('tulosta this: ', this)
        if (this._bounds._southWest !== undefined)
            this._latlng = this.getBounds().getCenter()
    })

    L.Polyline.include({
        getLatLng: function () {
            return this._latlng
        },
        setLatLng: function () {}
    })

    // Väänsin tähän tämmösen, että jos ei alussa oo mitään layergroup. Vaihda jos aiheuttaa ongelmia -T
    let newLayerGroup = givenMarkerLayerGroup !== undefined ? givenMarkerLayerGroup : L.markerClusterGroup(null)

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
            layer.on('click', () => handleMarkerClick(feature.properties.sportsPlaceId))
        }
    }

    //Oletettu että sisään tuleva taulukko on jo GeoJSON-muodossa
    givenGeoJsonArray.forEach(dataelement => {
        var geojson = getGeoJSON(dataelement)
        if(geojson.type === 'Point') {
            var geopoint = L.marker([geojson.coordinates[1], geojson.coordinates[0]], {
                sportsPlaceId: dataelement.sportsPlaceId
            })
            //Voidaan lisätä esim. tooltip tässä vaiheessa
            geopoint.bindTooltip(dataelement.name)
            geopoint.on('click', () => handleMarkerClick(dataelement.sportsPlaceId))
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
            if (geojson[0].type === 'LineString') {

                var geolinepoint = L.marker([geojson[0].coordinates[0][1], geojson[0].coordinates[0][0]]/*, {
                    sportsPlaceId: dataelement.sportsPlaceId
                }*/)
                geolinepoint.bindTooltip(dataelement.name + ' (Reitti)')
                geolinepoint.on('click', () => handleMarkerClick(dataelement.sportsPlaceId))
                newLayerGroup.addLayer(geolinepoint)

                if(!givenMap.hasLayer(givenLineStringLayerGroup)) {
                    givenMap.addLayer(givenLineStringLayerGroup)
                }

                var geoline = L.geoJSON(geojson)
                geoline.bindTooltip(dataelement.name + ' (Reitti)')
                geoline.on('click', () => handleMarkerClick(dataelement.sportsPlaceId))
                givenLineStringLayerGroup.addLayer(geoline)

                if(givenMap.hasLayer(givenLineStringLayerGroup) && givenMap.getZoom() <= 13) {
                    givenMap.removeLayer(givenLineStringLayerGroup)
                }
            }
        }
    })

    //Jos käytetään alussa newLayerGrouppia, niin lisätään se karttaan mukaan
    if(!isGivenMLG) givenMap.addLayer(newLayerGroup)
    //Luodaan poly-olioista Leafletin geoJson-taulukko ja lisätään haluttuun LayerGrouppiin
    var geoJsonLayer = L.geoJSON(geoJsonDrawArray, {
        onEachFeature: onEachFeature
    })
    newLayerGroup.addLayer(geoJsonLayer)
    return null
}

//Alustava liikkuminen sidebarin liikuntapaikkaa klikatessa
function moveWhenSidebarClicked(givenSportsPlaceId, givenSportsPlaceData, givenMap) {
    givenSportsPlaceData.forEach(dataelement => {
        var geojson = getGeoJSON(dataelement)
        if(givenSportsPlaceId === dataelement.sportsPlaceId) {
            if(geojson.type === 'Point') {
                console.log(geojson)
                var mapdestcoords = geojson.coordinates
                givenMap.flyTo([mapdestcoords[1], mapdestcoords[0]], 16)
            }
            else if(geojson.type === 'Polygon') {
                console.log(geojson)
                var mapdestpolycoords = geojson.coordinates[0][0]
                givenMap.flyTo([mapdestpolycoords[1], mapdestpolycoords[0]], 15)
            }
            else if (geojson[0].type === 'LineString') {
                console.log(geojson)
                var mapdestlinecoords = geojson[0].coordinates[0]
                givenMap.flyTo([mapdestlinecoords[1], mapdestlinecoords[0]], 15)
            }
        }
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


export { drawGeoJsonOnMap, boundsToCoordsNRad, moveWhenSidebarClicked }