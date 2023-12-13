import 'dotenv/config'
import express from 'express'
import fs from 'fs'
//import https from 'https'
import routes from './routes'
import cors from 'cors'

const PORT = process.env.PORT || 8079

const app = express()

app
  .use(cors())
  .use(express.json())
  .use(routes)
  .listen(PORT, () => console.log(`Server listener in port: ${PORT}`))

/* https.createServer({
  cert: fs.readFileSync('src/SSL/code.crt'),
  key: fs.readFileSync('src/SSL/code.key')
}, app).listen(443, () => console.log(`Server HTTPS listener in port: ${443}`)) */