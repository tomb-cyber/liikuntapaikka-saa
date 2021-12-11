import { React, useEffect, useState, useRef } from 'react'
import { Offcanvas, Button, Card, Collapse, Container, Row, Col, ListGroup, Pagination } from 'react-bootstrap'
import ArrowIcon from './ArrowIcon'
import {
    WIDE_SCREEN_THRESHOLD,
    OFFCANVAS_TOGGLE_THRESHOLD,
    OFFCANVAS_TRANSITION_TIME,
    OFFCANVAS_DEFAULT_VISIBILITY,
    SIDEBAR_WIDTH,
    TOGGLE_BUTTON_HEIGHT,
    VENUES_PER_PAGE } from '../constants'
import haeSaa from '../services/saatiedot'
import './Sidebar.css'
import TimeRangePicker from '@wojtekmaj/react-timerange-picker'


/**
 * Sidebarin pääkomponentti
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
                <Offcanvas.Body className='p-2 overflow-auto'>
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
    // listatut liikuntapaikat
    // jos on tehty haku, naytetaan hakua vastaavat liikuntapaikat
    // muutoin kaikki
    const [listedVenues, setListedVenues] = useState([])
    //kartalla aktivoituun liikuntapaikkaan liittyvia hommia
    const activeVenueCard = liikuntapaikat.find(lp => lp.sportsPlaceId === activeVenueCardId)
    const activeRef = useRef()
    useEffect(() => {
        // TODO: tahan jotaki elegantimpaa
        if (activeRef.current !== undefined) {
            activeRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [activeVenueCardId])
    //sivutukseen liittyvia hommia
    // nykyinen sivu
    const [currentPage, setCurrentPage] = useState(0)
    // nykyisella sivulla naytettavat liikuntapaikat
    const [venuesOnPage, setVenuesOnPage] = useState([])
    // spagetin minimointi
    const lastPageNumber = () => Math.floor(listedVenues.length / VENUES_PER_PAGE)
    // elementti johon skrollataan esim. sivua vaihdettaessa
    const topOfPage = useRef(null)
    // sivun vaihtamiseen kaytettava funktio
    const activatePage = (newPage) => {
        const clampedNewPage = Math.min(Math.max(0, newPage), lastPageNumber())
        setCurrentPage(clampedNewPage)
        setVenuesOnPage(listedVenues.slice(clampedNewPage * VENUES_PER_PAGE, clampedNewPage * VENUES_PER_PAGE + VENUES_PER_PAGE))
        // TODO: miksei scrollaa kaikilla sivuilla kun smooth?
        // topOfPage.current.scrollIntoView({ behavior: 'smooth' })
        topOfPage.current.scrollIntoView()
    }
    useEffect(() => {
        if (filter === '') setListedVenues(liikuntapaikat)
    }, [liikuntapaikat.length])
    useEffect(() => {
        // jos uusia liikuntapaikkoja ladatessa nykyisella sivulla alle maksimi lkm liikuntapaikkakortteja
        // laitetaan uusien paikkojen kortteja jonon jatkeeksi
        // if (venuesOnPage.length < VENUES_PER_PAGE) {
        setVenuesOnPage(listedVenues.slice(currentPage * VENUES_PER_PAGE, currentPage * VENUES_PER_PAGE + VENUES_PER_PAGE))
        console.log(listedVenues)
        // }
    }, [listedVenues.length])
    // hakutulosten filtteroimiseen liittyvia juttuja
    const [filter, setFilter] = useState('')
    const filterSearchResults = (results) => {
        setFilter(searchValue)
        setCurrentPage(0)
        setVenuesOnPage([])
        setListedVenues(results)
    }
    // useEffect(() => {
    //     setCurrentPage(0)
    //     setVenuesOnPage([])
    //     setListedVenues(filter === '' ? liikuntapaikat : liikuntapaikat.filter(lp => lp.name !== null && lp.name.toUpperCase().includes(searchValue.toUpperCase())))
    // }, [filter])
    const initiateSearch = (event) => {
        event.preventDefault()
        if (filter !== searchValue) {
            handleSearchSubmit(searchValue, filterSearchResults)
        }
    }
    const clearSearch = () => {
        if (filter !== '') {
            setFilter('')
            setSearchValue('')
            setCurrentPage(0)
            setVenuesOnPage([])
            setListedVenues(liikuntapaikat)
        }
    }
    const aikaNyt = new Date()
    const seuraavaTunti = new Date()
    seuraavaTunti.setHours(seuraavaTunti.getHours() + 1)
    const [value, onChange] = useState([aikaNyt, seuraavaTunti])
    return (
        <div>
            <form onSubmit={initiateSearch}>
                <Container fluid className='pb-2'>
                    <Row>
                        <Col className='p-0' xs={8}>
                            <input className='w-100' type='text' value={searchValue} onChange={(event) => setSearchValue(event.target.value)}></input>
                        </Col>
                        <Col className='p-0' xs={2}>
                            <button className='w-100' type='submit'>&#128270;</button>
                        </Col>
                        <Col className='p-0' xs={2}>
                            <button className='w-100' onClick={clearSearch}>X</button>
                        </Col>
                    </Row>
                    { filter !== '' ?
                        <Row>
                            <Col>Löytyi {listedVenues.length} liikuntapaikkaa hakusanalla {`"${filter}"`}</Col>
                        </Row>
                        : ''
                    }
                </Container>
            </form>
            {/* Ajanvalinta input -laatikko */}
            <TimeRangePicker
                onChange={onChange}
                value={value}
                disableClock={true}
                minTime={aikaNyt}
            />
            <div ref={topOfPage}></div>
            {/* Kartalla aktivoidun liikuntapaikan kortti */}
            { activeVenueCard !== undefined ? <ActivatedVenueCardWrapper innerRef={activeRef} key={`a${activeVenueCard.sportsPlaceId}`} venue={activeVenueCard} handleVCC={handleVCC} onExtend={extensionFunc} /> : '' }
            {/* {activeVenueCard !== undefined ? <div ref={activeRef}> <VenueCard key={'active'} venue={activeVenueCard} handleVCC={handleVCC} weather={mockData.saatilat} onExtend={extensionFunc}/> </div> : '' } */}
            { venuesOnPage.map((lp) => <VenueCard key={lp.sportsPlaceId} venue={lp} handleVCC={handleVCC} onExtend={extensionFunc} />) }
            <Pagination className='d-flex justify-content-center'>
                <Pagination.First onClick={() => activatePage(0)} />
                <Pagination.Prev onClick={() => activatePage(currentPage - 1)} />
                <Pagination.Item>Sivu {currentPage + 1} / {lastPageNumber() + 1} </Pagination.Item>
                <Pagination.Next onClick={() => activatePage(currentPage + 1)} />
                <Pagination.Last onClick={() => activatePage(lastPageNumber())} />
            </Pagination>
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
        //{ title: 'Rakennusvuosi', property: 'constructionYear' },
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
                //Lisätty lat ja lon jokaisen venuen tyypin koordinaattirakenteen mukaisesti -J
                if(venue.location.geometries.features[0].geometry.type === 'Point') {
                    const lat = venue.location.geometries.features[0].geometry.coordinates[1]
                    const lon = venue.location.geometries.features[0].geometry.coordinates[0]
                    haeSaa(`${lat},${lon}`, setWeather)
                } else if(venue.location.geometries.features[0].geometry.type === 'Polygon') {
                    const lat = venue.location.geometries.features[0].geometry.coordinates[0][0][1]
                    const lon = venue.location.geometries.features[0].geometry.coordinates[0][0][0]
                    haeSaa(`${lat},${lon}`, setWeather)
                } else if(venue.location.geometries.features[0].geometry.type === 'LineString') {
                    const lat = venue.location.geometries.features[0].geometry.coordinates[0][1]
                    const lon = venue.location.geometries.features[0].geometry.coordinates[0][0]
                    haeSaa(`${lat},${lon}`, setWeather)
                }
            }
        }
        animateArrow('arrow-' + venue.sportsPlaceId)
        setOpen(!open)
        console.log(details)
        console.log('w', weather)
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
                <Card.Title>{venue.name}<img src='/images/pin.svg' onClick={() => handleVCC(venue.sportsPlaceId)} className='float-end pe-1 pt-1'/ ></Card.Title>
                <Card.Body className='p-0'>
                    <Container className='w-100'>
                        <Row>
                            <Col xs={12} className='p-0'>{venue.type.name}</Col>
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

/**
* Palauttaa tuulen suuntaa ja nopeutta kuvaavan kuvan ja tekstin
* @param degree Tuulen suunnan aste
* @param speed Tuulen nopeus m/s
* @returns Div jossa nuoli annetussa kulmassa ja annettu nopeus
*/
const renderWindArrow = (degree, speed) => {
    if (degree === 0) {
        return(
            <div>
                0 m/s
            </div>
        )
    }

    return(
        <div>
            <img className='arrow' src='/images/arrow.svg' style={{  transform: `rotate(${degree}deg)` }} />
            {speed} m/s
        </div>
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
                <Col xs={4}>{info.lampotila}</Col>
                <Col xs={4}><img src={`/images/${info.saasymboli}.svg`} /></Col>
                <Col xs={4}>{renderWindArrow(info.tuulen_suunta,info.tuuli_ms)}</Col>
            </Row>
        </Container>
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