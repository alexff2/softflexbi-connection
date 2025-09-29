import axios from 'axios'

const api_filial = axios.create({
  baseURL: process.env.URL_API_DB
})

const api_matriz = axios.create({
  baseURL: process.env.URL_API_MATRIZ
})

export { api_filial, api_matriz }
