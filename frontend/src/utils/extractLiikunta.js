/**
 * Irrottaa Feature liikuntapaikasta GeoJSON geometry tiedot. HUOM reitit koostuvat useista samalla ID:llä
 * olevista Feature olioista, eli reittien tapauksessa liikuntapaikka on joukko Feature olioita, kun muuten on yksittäinen Feature.
 * @param liikuntapaikka Yksittäinen liikuntapaikka; voi olla reitti/LineString-joukko, piste/Point tai alue/Polygon.
 * @returns Liikuntapaikan geometry tiedot
 */
const getGeoJSON = (liikuntapaikka) => {
    console.log(liikuntapaikka)
    if (liikuntapaikka.geometry.type !== 'LineString') {
        return liikuntapaikka.geometry
    }

    return liikuntapaikka.map(each => each.geometry)
}


/**
 * Antaa liikuntapaikan koordinaatit.
 * @param liikuntapaikka Yksittäinen liikuntapaikka; voi olla reitti/LineString-joukko, piste/Point tai alue/Polygon.
 * @returns Liikuntapaikan koordinaatit
 */
const getCoords = (liikuntapaikka) => {
    if (liikuntapaikka.geometry.type !== 'LineString') {
        return liikuntapaikka.geometry.coordinates
    }

    return getGeoJSON(liikuntapaikka).map(each => each.coordinates)
}

export { getGeoJSON, getCoords }