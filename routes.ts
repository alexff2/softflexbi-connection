import express from 'express'
import api from './api'

const routes = express.Router()

routes.get('/', (require, response) => {
  return response.send('Conectado com sucesso!')
})
//routes.get('/representative', (require, response) => {})
//routes.get('/representative/description', representativeController.findByDescription)
//routes.get('/customers/:idRepresentative', customerController.findByRepresentative)
routes.get('/report/dre', async (require, response) => {
  try {
    const { dataInicial, dataFinal } = require.query
  
    const { data } = await api.get('/report/dre', {
      params: { dataFinal, dataInicial }
    })
  
    return response.json(data)
  } catch (error) {
    console.log(error)

    return response.status(400).json(error)
  }
})
//routes.get('/report/customerByRepresentative', customersByRepresentativeController.index)

export default routes
