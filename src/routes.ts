import express from 'express'
import { api_filial, api_matriz } from './api'

import userController from './controllers/userController'
import authController from './controllers/authController'

import { ensureAth } from './middlewares/ensureAuth'

const routes = express.Router()

type TPl = {
  DATA: Date
  VALOR_SAIDA: number
  VALOR_ENTRADA: number
  NUM_DOCUMENTO: number
  CLIENTE_FORNECEDOR: string
  HISTORICO: string
  ID_PORTADOR: number
  ID_PLAN_CONTA: number
}

routes.get('/authenticated/validation', ensureAth, authController.startAppValidations)
routes.post('/authenticated', authController.auth)
routes.post('/authenticated/google', authController.authGoogle)

routes.get('/user', ensureAth, userController.index)
routes.post('/user', ensureAth, userController.create)
routes.patch('/user/password', ensureAth, userController.updatePassword)
routes.post('/user/google', ensureAth, userController.createWithGoogle)
routes.post('/user/active', userController.active)

routes.get('/representative', async (_require, response) => {
  const { data } = await api_filial.get('/representative')
  return response.json(data)
})
routes.get('/representative/description', async (require, response) => {
  const { description } = require.query

  const { data } = await api_filial.get('/representative/description', {
    params: {
      description
    }
  })

  return response.json(data)
})
routes.get('/customers/:idRepresentative', async (require, response) => {
  const { idRepresentative } = require.params
  const { idShop, route } = require.query

  const { data } = await api_filial.get(`/customers/${idRepresentative}`, {
    params: { idShop, route }
  })
  return response.json(data)
})
routes.get('/report/dre', ensureAth, async (require, response) => {
  try {
    const { dataInicial, dataFinal, empresa, tipo, dataInicialCmp, dataFinalCmp } = require.query
    let api = api_filial
    
    if (empresa === '0') {
      api = api_matriz
    }

    const { data } = await api.get('/report/dre', {
      params: { dataFinal, dataInicial, tipo, dataInicialCmp, dataFinalCmp }
    })

    return response.json(data)
  } catch (error) {
    console.log(error)

    return response.status(400).json(error)
  }
})
routes.get('/report/customerByRepresentative', async (require, response) => {
  const { date, idRepresentative, idEstablishment, idShop, route } = require.query

  const { data } = await api_filial.get('/report/customerByRepresentative', {
    params: { date, idRepresentative, idEstablishment, idShop, route }
  })

  return response.json(data)
})
routes.get('/report/accounting-plan-georgia-titles', async (require, response) => {
  try {
    const { startDate, endDate } = require.query

    const { data } = await api_matriz.get<TPl[]>('/report/contabilidade', {
      params: { 
        dataInicial: startDate,
        dataFinal: endDate
       }
    })

    const dataResponse = data.map(item => ({
      ...item,
      DATA: new Date(item.DATA).toLocaleDateString('pt-BR'),
    }))
  
    return response.json({ ok: true, data: dataResponse})
  } catch (error) {
    console.log(error)
    return response.status(500).json({ ok: false, error: 'Internal server error' })
  }
})
export default routes
