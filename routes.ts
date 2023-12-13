import express, { response } from 'express'

const routes = express.Router()

routes.get('/', (require, response) => {
  return response.send('Conectado com sucesso!')
})
/* routes.get('/representative', representativeController.index)
routes.get('/representative/description', representativeController.findByDescription)
routes.get('/customers/:idRepresentative', customerController.findByRepresentative)
routes.get('/report/dre', dreController.index)
routes.get('/report/customerByRepresentative', customersByRepresentativeController.index) */

export default routes