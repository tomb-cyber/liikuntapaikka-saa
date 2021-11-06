/**
 * Irrottaa liikuntapaikasta GeoJSON geometry tiedot. HUOM reitit koostuvat useista samalla ID:llä
 * olevista Feature olioista, eli reittien tapauksessa liikuntapaikka on joukko Feature olioita, kun muuten on yksittäinen Feature.
 * @param liikuntapaikka Yksittäinen liikuntapaikka; voi olla reitti/LineString-joukko, piste/Point tai alue/Polygon.
 * @returns Liikuntapaikan geometry tiedot
 */
const getGeoJSON = (liikuntapaikka) => {
    console.log(liikuntapaikka)
    if (liikuntapaikka.location.geometries.features[0].geometry.type !== 'LineString') {
        return liikuntapaikka.location.geometries.features[0].geometry
    }

    return liikuntapaikka.location.geometries.features.map(each => each.geometry)
}


/**
 * Antaa liikuntapaikan kaikki koordinaatit GeoJSONista. Pisteellä yksi, alueilla ja reiteillä useita.
 * @param liikuntapaikka Yksittäinen liikuntapaikka; voi olla reitti/LineString-joukko, piste/Point tai alue/Polygon.
 * @returns Liikuntapaikan koordinaatit
 */
const getAllCoords = (liikuntapaikka) => {
    if (liikuntapaikka.location.geometries.features[0].geometry.type !== 'LineString') {
        return getGeoJSON(liikuntapaikka).coordinates
    }

    return getGeoJSON(liikuntapaikka).map(each => each.coordinates)
}


/**
 * Antaa liikuntapaikan koordinaatit wgs84 muodossa.
 * @param liikuntapaikka Yksittäinen liikuntapaikka; voi olla reitti/LineString-joukko, piste/Point tai alue/Polygon.
 * @returns Liikuntapaikan wgs84 koordinaatit
 */
const getCoordsWgs84 = (liikuntapaikka) => liikuntapaikka.location.coordinates.wgs84


/**
 * Antaa liikuntapaikan koordinaatit tm35fin muodossa.
 * @param liikuntapaikka Yksittäinen liikuntapaikka; voi olla reitti/LineString-joukko, piste/Point tai alue/Polygon.
 * @returns Liikuntapaikan tm35fin koordinaatit
 */
const getCoordsTm35fin = (liikuntapaikka) => liikuntapaikka.location.coordinates.tm35fin



export { getGeoJSON, getAllCoords, getCoordsTm35fin, getCoordsWgs84 }