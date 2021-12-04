import { React, useEffect, useState, useRef } from 'react'
import { Offcanvas, Button, Card, Collapse, Container, Row, Col, ListGroup } from 'react-bootstrap'
import InfiniteScroll from 'react-infinite-scroll-component'
import ArrowIcon from './ArrowIcon'
import {
    WIDE_SCREEN_THRESHOLD,
    OFFCANVAS_TOGGLE_THRESHOLD,
    OFFCANVAS_TRANSITION_TIME,
    OFFCANVAS_DEFAULT_VISIBILITY,
    SIDEBAR_WIDTH,
    TOGGLE_BUTTON_HEIGHT } from '../constants'
import haeSaa from '../services/saatiedot'
import './Sidebar.css'


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
const SidebarContent = ({ handleVCC, liikuntapaikat, handleSearchSubmit, searchValue, setSearchValue, extensionFunc, activeVenueCardId }) => {
    const activeVenueCard = liikuntapaikat.find(lp => lp.sportsPlaceId === activeVenueCardId)
    const activeRef = useRef()
    // montako liikuntapaikkaa maksimissaan per scrollaus
    // TODO: vakioihin
    const step = 20
    // seuraavan sidebarissa listaamattoman liikuntapaikan indeksi liikuntapaikat-taulukossa
    const [nextVenueIndex, setNextVenueIndex] = useState(0)
    // sidebarissa listatut liikuntapaikat
    const [listedVenues, setListedVenues] = useState([])
    // TODO: replace bandaid
    useEffect(() => initListedVenues(), [liikuntapaikat.length])
    // aktivoituu kun kartalla klikataan uutta liikuntapaikkaa
    // TODO: ei rullaa alkuun jos klikkaa samaa markeria kartalla kahdesti perakkain. Tama ok?
    useEffect(() => {
        // TODO: tahan jotaki elegantimpaa
        if (activeRef.current !== undefined) {
            activeRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [activeVenueCardId])
    const loadMoreVenues = () => {
        // setListedVenues([liikuntapaikat[4]])
        const nextNextIndex = Math.min(nextVenueIndex + step, liikuntapaikat.length)
        setListedVenues(listedVenues.concat(liikuntapaikat.slice(nextVenueIndex, nextNextIndex)))
        setNextVenueIndex(nextNextIndex)
    }
    const initListedVenues = () => {
        //TODO: replace mysteerivakio bandaid
        if (liikuntapaikat.length < 20 || nextVenueIndex !== 0) return
        console.log('init')
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
                    {/* Kartalla aktivoidun liikuntapaikan kortti */}
                    { activeVenueCard !== undefined ? <ActivatedVenueCardWrapper innerRef={activeRef} key={`a${activeVenueCard.sportsPlaceId}`} venue={activeVenueCard} handleVCC={handleVCC} onExtend={extensionFunc} /> : '' }
                    {/* {activeVenueCard !== undefined ? <div ref={activeRef}> <VenueCard key={'active'} venue={activeVenueCard} handleVCC={handleVCC} weather={mockData.saatilat} onExtend={extensionFunc}/> </div> : '' } */}
                    {listedVenues.map((lp) => <VenueCard key={lp.sportsPlaceId} venue={lp} handleVCC={handleVCC} onExtend={extensionFunc}/>)}
                </InfiniteScroll>
            </div>
        </div>
    )
}

/**
 * Liikuntapaikka-kortti, joita näytetään sidebarissa.
 */
const VenueCard = ( { venue, handleVCC, onExtend } ) => {
    const [open, setOpen] = useState(false)
    const [details, setDetails] = useState(null)
    const [weather, setWeather] = useState(null)
    const collapseId = `collapse-${venue.id}`

    const halututInfot = [
        { title: 'Rakennusvuosi', property: 'constructionYear' },
        { title: 'Liikuntapaikkatyyppi', property: 'type.name' },
        { title: 'Puhelinnumero', property: 'phoneNumber' },
        { title: 'Sähköposti', property: 'email' },
        { title: 'Verkkosivu', property: 'www' },
        { title: 'Lisätieto', property: 'properties.infoFi' },
    ]

    /**
     * Listaa kaikki halututInfot-taulukossa olevat liikuntapaikasta löytyvät tiedot
     * @returns Taulukko jossa ListGroup.Item-elementtejä joissa seloste ja tätä vastaava tieto
     */
    const returnAvailableDetails = () => {
        let id = 1
        return halututInfot.map(each => {
            if (detailsHasProperty(each.property)){
                let info = eval('details.' + each.property)
                let linkOrText = info
                if (each.property === 'www') {
                    info = info.startsWith('http') ? info : 'https://' + info
                    linkOrText =  <a href={info}>{info}</a>
                }

                return <ListGroup.Item key={id++}>{each.title + ': '} {linkOrText}
                </ListGroup.Item>
            }
        })
    }

    const handleButtonClick = () => {
        if (!open) {
            if (details === null) {
                onExtend(venue.sportsPlaceId).then(res => setDetails(res))
            }
            if (weather === null) {
                const lat = venue.location.geometries.features[0].geometry.coordinates[1]
                const lon = venue.location.geometries.features[0].geometry.coordinates[0]
                // setWeather(haeSaa(`${lat},${lon}`))
                setWeather(haeSaa(`${lat},${lon}`))
            }
        }
        animateArrow('arrow-' + venue.sportsPlaceId)
        setOpen(!open)
        console.log(details)
    }

    /**
     * Animoi annetun id:n omaavan nuolen
     * @param id ArrowIconin id
     */
    const animateArrow = (id) => {
        const item = document.getElementById(id)
        item.animate([
            { transform: 'rotate(0deg)', offset: 0 },
            { transform: 'rotate(180deg)', offset: 1 },
        ], {
            duration: 500, //milliseconds
            easing: 'ease-in-out',
            iterations: 1,
            direction: (open ? 'reverse' : 'normal'),
            fill: 'forwards'
        })
    }

    // Katso hasProperty:n dokumentaatio
    const detailsHasProperty = nestedProperties => hasProperty(details, nestedProperties)

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
                        {/* <Row>
                            <Col xs={12} className='p-0 pt-1 ps-1'>placeholder</Col>
                        </Row> */}
                    </Container>
                    <Collapse in={open}>
                        <div id={collapseId}>
                            <ListGroup>
                                <ListGroup.Item>
                                    { weather !== null ? weather.map(w => <WeatherRow key={w.aika} info={w} /> ) : '' }
                                </ListGroup.Item>
                                <ListGroup.Item>Osoite: {
                                    details === null ? '-' : `${details.location.address}, ${details.location.postalCode} ${details.location.city.name}`} </ListGroup.Item>
                                { returnAvailableDetails() }
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
                    className='pb-2 btn-light'
                >
                    { //open ? '↑' : '↓'
                    }
                    <ArrowIcon id={'arrow-' + venue.sportsPlaceId} />
                </Button>
            </Card>
        </>
    )
}

// Yksittainen saatietorivi sidebarissa
const WeatherRow = ({ info }) => {
    console.log(info)
    return (
        <Container>
            <Row>
                <Col>{info.aika}</Col>
            </Row>
            <Row>
                <Col xs={3}>{info.lampotila}</Col>
                <Col xs={3}>{info.saasymboli}</Col>
                <Col xs={3}>{info.tuuli_ms}</Col>
                <Col xs={3}>{info.tuulen_suunta}</Col>
            </Row>
        </Container>
        // <>
        //     <p>{info.aika}</p>
        //     <p>{info.lampotila}</p>
        //     <p>{info.saasymboli}</p>
        //     <p>{info.tuuli_ms}</p>
        //     <p>{info.tuulen_suunta}</p>
        // </>
    )
}

// wrapperi kartalta klikatun liikuntapaikan kortille
// jotta animaatiot ym ei sotke liikaa sidebarContent -komponenttia
const ActivatedVenueCardWrapper = (props) => {
    const [className, setClassName] = useState({})
    useEffect(() => {
        setClassName('blinker')
        setTimeout(() => setClassName(''), 1000)
    }, [])
    return <div className={className} ref={props.innerRef}><VenueCard {...props} /></div>
}

/**
 * Tutkii onko annetulla oliolla annettu property. Jos olio on x ja etsitään tämän ominaisuutta y.z eli x.y.z,
 * on kutsu muotoa hasProperty(x, 'y.z')
 * @param obj Tutkittava olio
 * @param nestedProperties Etsittävä property stringinä
 * @returns True jos oliolla on etsitty property, ja päinvastoin
 */
const hasProperty = (obj, nestedProperties) => {
    return nestedProperties.split('.').every(part => {
        if(typeof obj !== 'object' || obj === null || !(part in obj))
            return false
        obj = obj[part]
        return true
    })
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