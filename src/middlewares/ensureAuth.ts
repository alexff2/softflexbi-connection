import { Request, Response, NextFunction } from "express"
import { verify } from 'jsonwebtoken'
import AppError from "../utils/AppError"

declare global {
  namespace Express {
    interface Request {
      userEmail: string
    }
  }
}

export function ensureAth(req: Request, res: Response, next: NextFunction){
  const token = req.headers.authorization

  if (!token) {
    throw new AppError('JWT não informado!')
  }

  verify(token, String(process.env.SECRET_KEY_TOKEN), (error, decoded) => {
    if (error) {
      throw new AppError(error.message, 401)
    }

    if (decoded) {
      req.userEmail = String(decoded.sub)
    }

    next()
  })

}