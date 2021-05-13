import Country from './Country'


const Countries = ({ countries, setFilteredCountries, setSearchQuery, getWeather }) => {
  const handleShow = cntry => {
    setFilteredCountries([cntry])
    setSearchQuery(cntry.name)
  }
  if (countries.length === 1) {
    var country = countries[0]
    return (
      <Country country={country} getWeather={getWeather} />
    )

  } else if (countries.length > 1 && countries.length < 10) {
    return (
      countries.map(c => <p key={c.name}>{c.name} <button onClick={()=>handleShow(c)}>show</button></p>)
    )
  } else if (countries.length >= 10) {
    return <p>Too many matches, specify another filter</p>
  } else {
    return <p>Type something for search.</p>
  }
}

export default Countries