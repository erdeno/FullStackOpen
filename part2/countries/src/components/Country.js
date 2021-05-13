import { useState, useEffect } from 'react'

const Country = ({ country, getWeather }) => {
  const [weather, setWeather] = useState({})

  useEffect(() => {
    getWeather(country.capital)
      .then(
        res => {
          setWeather({
            temp: res.current.temperature,
            wind_speed: res.current.wind_speed,
            wind_dir: res.current.wind_dir,
            icon: res.current.weather_icons[0]
          })
        }
      )
  }, [getWeather, country.capital])
  return (
    <>
      <h2>{country.name}</h2>
      <p>capital: {country.capital}</p>
      <p>population: {country.population}</p>

      <h4>languages</h4>
      <ul>
        {country.languages.map(l => <li key={l.name}>{l.name}</li>)}
      </ul>

      <img src={country.flag} width='100' alt='flag' />

      <h4>Weather in {country.capital}</h4>

      <p>temperature: {weather.temp}</p>
      <img src={weather.icon} width='100' alt='weather_icon' />
      <p>wind: {weather.wind_speed} mph direction {weather.wind_dir}</p>


    </>
  )
}

export default Country