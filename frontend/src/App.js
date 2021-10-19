import './App.css';
import React, { useEffect, useState } from 'react'
import homeService from './services/home'


const App = () => {

  const [data, setData] = useState([])

  useEffect(() => {
    homeService
      .getAll()
      .then(res => setData(res))
  }, [])

  return (
    <div className="App">
      { data.map(i => i + ' ') }
    </div>
  );
}

export default App;
