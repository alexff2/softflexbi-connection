import express from 'express'
import api from './api'

import userController from './controllers/userController'
import authController from './controllers/authController'

import { ensureAth } from './middlewares/ensureAuth'

const routes = express.Router()

routes.get('/authenticated/validation', ensureAth, authController.startAppValidations)
routes.post('/authenticated', authController.auth)
routes.post('/authenticated/google', authController.authGoogle)

routes.get('/user', ensureAth, userController.index)
routes.post('/user', ensureAth, userController.create)
routes.patch('/user/password', ensureAth, userController.updatePassword)
routes.post('/user/google', ensureAth, userController.createWithGoogle)
routes.post('/user/active', userController.active)

routes.get('/representative', async (require, response) => {
  const { data } = await api.get('/representative')
  return response.json(data)
})
routes.get('/representative/description', async (require, response) => {
  const { description } = require.query

  const { data } = await api.get('/representative/description', {
    params: {
      description
    }
  })

  return response.json(data)
})
routes.get('/customers/:idRepresentative', async (require, response) => {
  const { idRepresentative } = require.params
  const { idShop, route } = require.query

  const { data } = await api.get(`/customers/${idRepresentative}`, {
    params: { idShop, route }
  })
  return response.json(data)
})
routes.get('/report/dre', ensureAth, async (require, response) => {
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
routes.get('/report/customerByRepresentative', async (require, response) => {
  const { date, idRepresentative, idEstablishment, idShop, route } = require.query

  const { data } = await api.get('/report/customerByRepresentative', {
    params: { date, idRepresentative, idEstablishment, idShop, route }
  })

  return response.json(data)
})
export default routes
