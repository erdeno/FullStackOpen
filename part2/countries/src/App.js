import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Countries from './components/Countries'
import countryService from './services/countries'


function App() {
  const [countries, setCountries] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCountries, setFilteredCountries] = useState(null)

  const handleSearch = (event) => {
    const q = event.target.value
    const c = countries.filter(i => i.name.toLowerCase().includes(q.toLowerCase()))
    setSearchQuery(q)
    if (c.length <= 10) {
      setFilteredCountries(c)

    } else {
      setFilteredCountries(null)
    }
  }

  useEffect(() => {
    countryService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  }, [])


  return (
    <div>
      <Filter
        searchQuery={searchQuery}
        handleSearch={handleSearch}
      />
      <Countries
        countries={filteredCountries ? filteredCountries : countries}
        setFilteredCountries={setFilteredCountries}
        setSearchQuery={setSearchQuery}
        getWeather={countryService.getWeather}
      />

    </div>
  );
}

export default App;
