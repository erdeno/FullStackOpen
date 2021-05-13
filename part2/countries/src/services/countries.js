import axios from 'axios'

const baseUrl = 'https://restcountries.eu/rest/v2/all'
const api_key = process.env.REACT_APP_API_KEY


const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getWeather = (capital) => {
  const url = `http://api.weatherstack.com/current?access_key=${api_key}&query=${capital}`
  const request = axios.get(url)
  return request.then(response=>response.data)
}

// eslint-disable-next-line
export default { getAll, getWeather }