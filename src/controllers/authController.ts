import { Request, Response } from 'express'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import prisma from '../utils/prisma'
import AppError from '../utils/AppError'

export default {
  async auth( req: Request, res: Response ) {
    const { email, password } = req.body

    if (!email || !password) {
      throw new AppError('Informe usuário e senha!', 401)
    }

    const user = await prisma.user.findFirst({
      where: { email }
    })

    if (!user) {
      throw new AppError('Usuário ou senha inválidos')
    }

    if (user.password === null) {
      throw new AppError('Usuário não validado')
    }

    const passwordMath = await compare(password, user.password)

    if (!passwordMath) {
      throw new AppError('Usuário ou senha inválidos')
    }

    const token = sign({}, String(process.env.SECRET_KEY_TOKEN), {
      subject: String(user.email),
      expiresIn: String(process.env.DAYS_EXPIRES_TOKEN)
    })

    return res.json({
      user,
      token
    })
  },
  async authGoogle( req: Request, res: Response ){
    const { uidGoogle } = req.body

    if (!uidGoogle) {
      throw new AppError('Forneça todos os recursos')
    }

    const user = await prisma.user.findFirst({
      where: { uidGoogle }
    })

    if (!user) {
      throw new AppError('Usuário não autorizado', 404)
    }

    if (user.password === null) {
      throw new AppError('Usuário não registrado, clique em "Registra-se com Google!"')
    }

    const passwordMath = compare(uidGoogle, user.password)

    if (!passwordMath) {
      throw new AppError('Usuário não autorizado', 404)
    }

    const token = sign({}, String(process.env.SECRET_KEY_TOKEN), {
      subject: String(user.email),
      expiresIn: String(process.env.DAYS_EXPIRES_TOKEN)
    })

    return res.json({
      user,
      token
    })
  },
  async startAppValidations( req: Request, res: Response ) {
    return res.json('Token válido!')
  }
}
