import 'dotenv/config'
import 'express-async-errors'
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import routes from './routes'
import AppError from './utils/AppError'

const PORT = process.env.PORT || 8079

const app = express()

app
  .use(cors())
  .use(express.json())
  .use(routes)
  .use((error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        status: "error",
        message: error.message
      })
    }

    console.log(error)

    return response.status(500).json({
      status: "error",
      message: "Internal server error"  
    })
  })
  .listen(PORT, () => console.log(`Server listener in port: ${PORT}`))
