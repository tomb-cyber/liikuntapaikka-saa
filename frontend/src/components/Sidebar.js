import { React, useState } from 'react'
import { Offcanvas, Button, Card, Collapse, Container, Row, Col, ListGroup } from 'react-bootstrap'
import {
    WIDE_SCREEN_THRESHOLD,
    OFFCANVAS_TOGGLE_THRESHOLD,
    OFFCANVAS_TRANSITION_TIME,
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
                // style overridettää bootstrapin offcanvasin oletusanimaation
                style={{ transition: `transform ${OFFCANVAS_TRANSITION_TIME}s ease-in-out` }}
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
                    >↓</Button>
                </Offcanvas.Header>
                <Offcanvas.Body className='p-2'>
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
            {mockData.paikat.map((x, i) => <VenueCard key={i} venue={x} weather={mockData.saatilat} />)}
        </div>
    )
}

/**
 * Liikuntapaikka-kortti, joita näytetään sidebarissa.
 */
const VenueCard = ( { venue, weather } ) => {
    const [open, setOpen] = useState(false)
    const collapseId = `collapse-${venue.id}`
    console.log(weather)

    return (
        <>
            <Card className='mb-2 shadow'>
                <Card.Title>{venue.name}</Card.Title>
                <Card.Body className='p-0'>
                    <Container className='w-100'>
                        <Row>
                            <Col xs={10} className='p-0 ps-1 pe-4'>{venue.description}</Col>
                            <Col xs={2} className='p-0'>{venue.indoors ? 'sisä' : 'ulko'}</Col>
                        </Row>
                        <Row>
                            <Col xs={12} className='p-0 pt-1 ps-1'>{weather[0].type} {weather[0].temp} °C</Col>
                        </Row>
                    </Container>
                    <Collapse in={open}>
                        <div id={collapseId}>
                            <ListGroup>
                                <ListGroup.Item>
                                    { weather.map((x, i) => (
                                        <div key={i}>{i*20} min {x.type} {x.temp} °C</div>
                                    ))}
                                </ListGroup.Item>
                                <ListGroup.Item>Muuta lisätietoa?</ListGroup.Item>
                                <ListGroup.Item>Lisää muuta tietoa?</ListGroup.Item>
                            </ListGroup>
                        </div>
                    </Collapse>
                </Card.Body>
                <Button
                    variant={'secondary'}
                    size='sm'
                    onClick={() => setOpen(!open)}
                    aria-controls={collapseId}
                    aria-expanded={open}
                >
                    { open ? '↑' : '↓'}
                </Button>
            </Card>
        </>
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

    // true jos threshold tayttynyt
    const thresholdPassed = (y) => (y - startY) / threshold >= 1

    // kosketuksen alkaessa alustetaan startY-muuttuja
    const start = (event) => (startY = event.touches[0].screenY)

    // jos sipaisun aikana ylitetaan threshold, kutsutaan parametrina tuotua funktioa
    const move = (event) => {
        if (thresholdPassed(event.touches[0].screenY)) onThresholdPassed()
    }

    return {
        start,
        move,
    }
}

export default Sidebar