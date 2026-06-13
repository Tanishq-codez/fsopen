import { useState, useEffect } from 'react'
import axios from 'axios'

const Button = ({handleShow})=>{
  return (
    <button onClick={handleShow}>Show</button>
  )
}
const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
 
  // Fetch all countries data once when the component mounts
  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
      .catch(error => {
        console.error('Error fetching country data:', error)
      })
  }, [])

  const handleShow = ()=>{
    
  }
   const CountryDisplay = ({ countries }) => {
  // Scenario 1: No search query or no matches
  if (countries.length === 0) {
    return null
  }

  // Scenario 2: Too many matches
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  // Scenario 3: Single matching country - show detailed view
  if (countries.length === 1) {
    const country = countries[0]
    return (
      <div>
        <h2>{country.name.common}</h2>
        <div>capital {country.capital?.[0]}</div>
        <div>area {country.area}</div>
        
        <h3>languages:</h3>
        <ul>
          {Object.values(country.languages || {}).map(lang => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>
        
        <div style={{ fontSize: '100px', marginTop: '10px' }}>
          {country.flag}
        </div>
      </div>
    )
  }

  // Scenario 4: Between 2 and 10 matches - show simple list
  return (
    <ul>
      {countries.map(c => (
        <li key={c.cca3}>{c.name.common}
        <Button handleShow={handleShow}/>
        </li>
        
      ))}
    </ul>
  )
}
  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  // Filter countries based on the search query
  const countriesToShow = search
    ? countries.filter(c => c.name.common.toLowerCase().includes(search.toLowerCase()))
    : []

  return (
    <div>
      <div>
        find countries <input value={search} onChange={handleSearchChange} />
      </div>
      
      <div style={{ marginTop: '10px' }}>
        <CountryDisplay countries={countriesToShow} />
      </div>
    </div>
  )
}

export default App