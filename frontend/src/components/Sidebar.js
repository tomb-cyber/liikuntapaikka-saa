import { React, useState } from 'react'
import { Offcanvas, Button } from 'react-bootstrap'
import {
    WIDE_SCREEN_THRESHOLD,
    OFFCANVAS_TOGGLE_THRESHOLD,
    OFFCANVAS_TOGGLE_ON_END,
    OFFCANVAS_DEFAULT_VISIBILITY,
    SIDEBAR_WIDTH,
    TOGGLE_BUTTON_HEIGHT } from '../constants'


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

/**
 * Sidebarin pääkompinentti
 * @param {int} windowWidth - nykyinen ikkunan leveys
 * @returns SidebarOffcanvas, jos ikkunan leveys alle thresholdin. Muutoin SidebarRegular
 */
const Sidebar = ({ windowWidth }) => {
    return windowWidth < WIDE_SCREEN_THRESHOLD ? (
        <SidebarOffcanvas />
    ) : (
        <SidebarRegular />
    )
}

/**
 * Leveällä ruudulla näytettävä sidebar
 */
const SidebarRegular = () => {
    return (
        <div
            id='sidebar'
            className='position-fixed top-0 left-0 visible h-100 bg-light p-1 shadow'
            style={{ width: SIDEBAR_WIDTH }}
        >
            <SidebarContent />
        </div>
    )
}

/**
 * Kapealla ruudulla näytettävä sidebar
 */
const SidebarOffcanvas = () => {
    const [visible, setVisible] = useState(OFFCANVAS_DEFAULT_VISIBILITY)
    const handleOpen = () => setVisible(true)
    const handleClose = () => setVisible(false)

    // avaamiseen ja sulkemiseen kaytettavien buttonien touchEvent-apustimet
    const tlOpen = touchListener(-OFFCANVAS_TOGGLE_THRESHOLD, handleOpen)
    const tlClose = touchListener(OFFCANVAS_TOGGLE_THRESHOLD, handleClose)

    return (
        <>
            <Offcanvas
                id='sidebar'
                show={visible}
                placement='bottom'
                backdrop={false}
                className='h-50 overflow-hidden'
            >
                <Offcanvas.Header className='p-0'>
                    {/* Offcanvasin piilottamiseen kaytettava painike */}
                    <Button
                        variant='primary'
                        className='w-100'
                        style={{ height: TOGGLE_BUTTON_HEIGHT }}
                        onClick={handleClose}
                        onTouchStart={(event) => tlClose.start(event)}
                        onTouchMove={(event) => tlClose.move(event)}
                        onTouchEnd={(event) => tlClose.end(event)}
                    >↓</Button>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <SidebarContent />
                </Offcanvas.Body>
            </Offcanvas>
            {/* Offcanvasin avaamiseen kaytettava painike */}
            <Button
                id='offcanvas-open-button'
                variant='primary'
                className='w-100 position-fixed bottom-0 d-md-none'
                style={{ height: TOGGLE_BUTTON_HEIGHT }}
                onClick={handleOpen}
                onTouchStart={(event) => tlOpen.start(event)}
                onTouchMove={(event) => tlOpen.move(event)}
                onTouchEnd={(event) => tlOpen.end(event)}
            >↑</Button>
        </>
    )
}

/**
 * Sidebarin kontentti, joka näytetään sekä regular että offcanvas-sidebarissa
 */
const SidebarContent = () => {
    //TODO: Oikeaa dataa sisaan
    return (
        <div>
            <h4>Search & Filter Placeholder</h4>
            {mockData.paikat.map(x => VenueCard(x, mockData.saatilat))}
        </div>
    )
}

/**
 * Liikuntapaikka-kortti, joita näytetään sidebarissa.
 */
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

/**
 * apufunktio offcanvas-sidebarin toggle-buttonin sipaisujen kasittelyyn
 * @param {int} threshold - y-erotus lahtopisteesta pikseleina ennen kuin aktivoituu
 * @param {function} onThresholdPassed - aktivoituessa kutsuttava funktio
 * @returns kasa touchEventin yhteydessa kutsuttavia funktioita
 */
const touchListener = (threshold, onThresholdPassed) => {
    let startY      // muuttuja johon touchin nykyista y-arvoa verrataan

    // kumpaan suuntaan kunkin hetkista y-arvoa verrataan
    const thresholdPassed =
        threshold < 0
            ? (y) => y < startY + threshold
            : (y) => y > startY + threshold

    // kosketuksen alkaessa alustetaan startY-muuttuja
    const start = (event) => (startY = event.touches[0].screenY)

    // jos sipaisun aikana ylitetaan threshold, kutsutaan parametrina tuotua funktioa
    const move = (event) => {
        if (thresholdPassed(event.touches[0].screenY)) onThresholdPassed()
    }

    const end = (event) => {
        // sipaisun loppuessa kuljettu u-etaisyys
        const dY = event.changedTouches[0].screenY - startY
        // jos "toggle on end" on kaytossa ja sipaisu on tapahtunut thresholdin y-suuntaan lahtopisteesta
        if (OFFCANVAS_TOGGLE_ON_END && dY / Math.abs(dY) === threshold / Math.abs(threshold)) {
            onThresholdPassed()
        }
    }

    return {
        start,
        move,
        end
    }
}

export default Sidebar