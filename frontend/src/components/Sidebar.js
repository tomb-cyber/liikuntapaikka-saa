import { React, useEffect, useState } from 'react'
import { Offcanvas, Button, Card, Collapse, Container, Row, Col, ListGroup } from 'react-bootstrap'
import InfiniteScroll from 'react-infinite-scroll-component'
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
const Sidebar = (props) => {
    const [searchValue, setSearchValue] = useState('')
    return props.windowWidth < WIDE_SCREEN_THRESHOLD ? (
        <SidebarOffcanvas {...props} searchValue={searchValue} setSearchValue={setSearchValue} />
    ) : (
        <SidebarRegular {...props} searchValue={searchValue} setSearchValue={setSearchValue} />
    )
}

/**
 * Leveällä ruudulla näytettävä sidebar
 */
const SidebarRegular = (props) => {
    return (
        <div
            id='infinite-scroll'
            className='position-fixed top-0 left-0 visible h-100 bg-light p-1 shadow overflow-auto'
            style={{ width: SIDEBAR_WIDTH }}
        >
            <SidebarContent {...props} />
        </div>
    )
}

/**
 * Kapealla ruudulla näytettävä sidebar
 */
const SidebarOffcanvas = (props) => {
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
                <Offcanvas.Body id='infinite-scroll' className='p-2 overflow-auto'>
                    <SidebarContent {...props} />
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
const SidebarContent = ({ handleVCC, liikuntapaikat, handleSearchSubmit, searchValue, setSearchValue, extensionFunc }) => {
    const step = 20
    const [nextVenueIndex, setNextVenueIndex] = useState(0)
    const [listedVenues, setListedVenues] = useState([])
    // TODO: Karttaa scrollautumisen / datan paivittymisen yhteydessa ei toivottua toiminnallisuutta
    useEffect(() => initListedVenues(), [])
    const resetListedVenues = () => {
        setNextVenueIndex(0)
        setListedVenues([])
    }
    const loadMoreVenues = () => {
        // setListedVenues(listedVenues.concat(liikuntapaikat.slice(nextVenueIndex, nextVenueIndex + step)))
        const nextNextIndex = nextVenueIndex + step
        setListedVenues(listedVenues.concat(liikuntapaikat.slice(nextVenueIndex, nextNextIndex)))
        setNextVenueIndex(nextNextIndex)
        console.log('listed venues length:' , listedVenues.length)
    }
    const initListedVenues = () => {
        console.log('init')
        resetListedVenues()
        loadMoreVenues()
    }
    return (
        <div>
            <form onSubmit={(event) => {event.preventDefault(); handleSearchSubmit(searchValue)}}>
                <Container fluid>
                    <Row>
                        <Col className='p-0' xs={10}>
                            <input className='w-100' type='text' value={searchValue} onChange={(event) => setSearchValue(event.target.value)}></input>
                        </Col>
                        <Col className='p-0' xs={2}>
                            <button className='w-100' type='submit'>&#128270;</button>
                        </Col>
                    </Row>
                </Container>
            </form>
            <div className='overflow-auto'>
                <InfiniteScroll
                    dataLength={listedVenues.length}
                    next={loadMoreVenues}
                    hasMore={listedVenues.length < liikuntapaikat.length}
                    loader={<h3>Ladataan...</h3>}
                    scrollableTarget='infinite-scroll'>
                    {listedVenues.map((lp) => <VenueCard key={lp.sportsPlaceId} venue={lp} handleVCC={handleVCC} weather={mockData.saatilat} onExtend={extensionFunc}/>)}
                </InfiniteScroll>
            </div>
        </div>
    )
}

/**
 * Liikuntapaikka-kortti, joita näytetään sidebarissa.
 */
const VenueCard = ( { venue, handleVCC, weather, onExtend } ) => {
    const [open, setOpen] = useState(false)
    const [details, setDetails] = useState(null)
    const collapseId = `collapse-${venue.id}`

    const handleButtonClick = () => {
        if (!open && details === null) {
            onExtend(venue.sportsPlaceId).then(res => setDetails(res))
        }
        setOpen(!open)
        console.log(details)
    }

    return (
        <>
            <Card id={`sidebar-vc-id-${venue.sportsPlaceId}`} className='mb-2 shadow'>
                <Card.Title>{venue.name}<span onClick={() => handleVCC(venue.sportsPlaceId)} className='float-end'>🧐</span></Card.Title>
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
                                <ListGroup.Item>Osoite: { /* Miten saada null/undefined tarkastukset järkevästi? Nyt kaatuu jo, jos esim. antaa tarkastusfunktiolle jotain x.undefined.y*/
                                    details === null ? '-' : `${details.location.address}, ${details.location.postalCode} ${details.location.city.name}`} </ListGroup.Item>
                                <ListGroup.Item>Rakennusvuosi: {details === null ? '-' : details.constructionYear} </ListGroup.Item>
                                <ListGroup.Item>Liikuntapaikkatyyppi: {details === null ? '-' : details.type.name} </ListGroup.Item>
                                <ListGroup.Item>Lisätieto: {details === null || details.properties === undefined || details.properties.infoFi === undefined ? '-' : details.properties.infoFi} </ListGroup.Item>
                                <ListGroup.Item>Lisää muuta tietoa?</ListGroup.Item>
                            </ListGroup>
                        </div>
                    </Collapse>
                </Card.Body>
                <Button
                    variant={'secondary'}
                    size='sm'
                    onClick={handleButtonClick}// setOpen(!open)}
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