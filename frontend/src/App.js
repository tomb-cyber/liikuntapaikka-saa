import './App.css'
import React, { useEffect, useState } from 'react'
import homeService from './services/home'
//import liikuntapaikkaService from './services/liikuntapaikat'
import Sidebar from './components/Sidebar'

const App = () => {

    const [data, setData] = useState([])

    useEffect(() => {
        homeService
            .getAll()
            .then(res => setData(res))
    }, [])

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div id='sidebar' className='bg-light'>
                    <Sidebar />
                </div>
                <div className='col bg-info'>
                    <p>Map Placeholder</p>
                    { data.map(i => i + ' ') }
                </div>
            </div>
        </div>
    )
}

export default App
