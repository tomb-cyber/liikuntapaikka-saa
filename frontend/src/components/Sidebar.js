import React from 'react'

// TODO: poista kun tarpeeton
const mockData = {
    paikat: [
        { id: 1, name: 'Liikuntapaikka X', indoors: true, description: 'Liikuntapaikkatyyppi, Lisatietoja, Yms' },
        { id: 2, name: 'Liikuntapaikka Y', indoors: false, description: 'Liikuntapaikkatyyppi, Lisatietoja, Yms' },
        { id: 3, name: 'Liikuntapaikka Z', indoors: true, description: 'Liikuntapaikkatyyppi, Lisatietoja, Yms' },
        { id: 4, name: 'Liikuntapaikka Å', indoors: true, description: 'Liikuntapaikkatyyppi, Lisatietoja, Yms' },
        { id: 5, name: 'Liikuntapaikka Ä', indoors: false, description: 'Liikuntapaikkatyyppi, Lisatietoja, Yms' },
        { id: 6, name: 'Liikuntapaikka Ö', indoors: false, description: 'Liikuntapaikkatyyppi, Lisatietoja, Yms' },
        { id: 7, name: 'Liikuntapaikka 0', indoors: true, description: 'Liikuntapaikkatyyppi, Lisatietoja, Yms' },
        { id: 8, name: 'Liikuntapaikka 1', indoors: true, description: 'Liikuntapaikkatyyppi, Lisatietoja, Yms' },
        { id: 9, name: 'Liikuntapaikka 2', indoors: false, description: 'Liikuntapaikkatyyppi, Lisatietoja, Yms' },
        { id: 10, name: 'Liikuntapaikka 3', indoors: true, description: 'Liikuntapaikkatyyppi, Lisatietoja, Yms' },
        { id: 11, name: 'Liikuntapaikka 4', indoors: false, description: 'Liikuntapaikkatyyppi, Lisatietoja, Yms' },
    ],
    saatilat: [
        { temp: 12, windDir: 15, windSpeed: 3, type: 'Aurinkoista ☀️' },
        { temp: -12, windDir: 120, windSpeed: 8, type: 'Pyryttää 🌨️' },
        { temp: 32, windDir: 0, windSpeed: 0, type: 'Aurinkoista ☀️' },
        { temp: 5, windDir: 360, windSpeed: 6, type: 'Pilvistä ☁️' },
        { temp: -35, windDir: 190, windSpeed: 1, type: 'Aurinkoista ☀️' },
    ]
}

const Sidebar = () => {
    return (
        <div>
            <h4>Search & Filter Placeholder</h4>
            {mockData.paikat.map(x => VenueCard(x, mockData.saatilat))}
        </div>
    )
}

const VenueCard = ( venue, weather ) => {
    // viittaa juuri taman liikuntapaikan saatietojen collapseen
    const weatherInfoElementId = `weather-info-${venue.id}`
    return (
        <div className='card mb-2 shadow'>
            <h3 className='card-title'>{venue.name}</h3>
            <div className='card-body p-0'>
                <div className='container w-100'>
                    <div className='row'>
                        <div className='col-10 p-0'>{ venue.description }</div>
                        <div className='col-2 p-0 '>{ venue.indoors ? 'sisä' : 'ulko' }</div>
                    </div>
                </div>
                <div className='ms-3'>{ weather[0].type } { weather[0].temp } °C</div>
                <div className='collapse' id={weatherInfoElementId}>
                    {/* <div className='card card-body m-2 p-1'> */}
                    <div className='list-group'>
                        <div className='list-group-item'>
                            Sääennuste
                            { weather.map((x, i) => i === 0 ? '' : <div>{i*20} min {x.type} {x.temp} °C</div>) }
                        </div>
                        <div className='list-group-item'>
                            Muuta lisätietoa?
                        </div>
                        <div className='list-group-item'>
                            Lisää muuta tietoa?
                        </div>
                    </div>
                </div>
            </div>
            <button
                type='button'
                className='btn btn-secondary btn-sm w-100'
                data-bs-toggle='collapse'
                data-bs-target={`#${weatherInfoElementId}`}
                aria-expanded='false'
                aria-controls={weatherInfoElementId}>
                ↕
            </button>
        </div>
    )
}

export default Sidebar