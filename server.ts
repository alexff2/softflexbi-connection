import 'dotenv/config'
import express from 'express'
import routes from './routes'
import cors from 'cors'

const PORT = process.env.PORT || 8079

const app = express()

app
  .use(cors())
  .use(express.json())
  .use(routes)
  .listen(PORT, () => console.log(`Server listener in port: ${PORT}`))
