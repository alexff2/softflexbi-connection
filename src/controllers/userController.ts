import { Request, Response } from 'express'
import { hash } from 'bcryptjs'

import prisma from '../utils/prisma'
import AppError from '../utils/AppError'

export default {
  async index( req: Request, res: Response ){
    const users = await prisma.user.findMany()

    return res.status(201).json(users)
  },
  async create( req: Request, res: Response ){
    const { userName, email, password, rePassword, type } = req.body

    if (!userName || !email || !password || !type) {
      throw new AppError('Informe todos os recursos!')
    }

    if (password.length < 6) {
      throw new AppError('Senha deve conter no mínimo 6 caracteres!')
    }

    if (password !== rePassword) {
      throw new AppError('Senhas não são iguais!')
    }

    const userExistent = await prisma.user.findFirst({
      where: { email }
    })

    if (userExistent) {
      throw new AppError('Usuário já cadastrado', 409)
    }

    const passwordHash = await hash(password, 8)

    const user = await prisma.user.create({
      data: { name: userName, email, password: passwordHash, status: 'on', type }
    })

    return res.status(201).json(user)
  },
  async createWithGoogle( req: Request, res: Response ){
    const { email, type } = req.body
    const emailRequest = String(email)

    if (!emailRequest || !type) {
      throw new AppError('Informe todas os recursos')
    }

    const isGmail = emailRequest.split('@')

    if (isGmail[1] !== 'gmail.com') {
      throw new AppError('Email inválido!')
    }

    const userExistent = await prisma.user.findFirst({
      where: { email: emailRequest }
    })

    if (userExistent) {
      throw new AppError('Usuário já cadastrado!', 409)
    }

    const result = await prisma.user.create({
      data: {
        email: emailRequest, status: 'off', type
      }
    })

    return res.status(201).json(result)
  },
  async active( req: Request, res: Response ){
    const { userName, email, uidGoogle, avatar_url } = req.body

    if (!userName || !email || !uidGoogle || !avatar_url) {
      throw new AppError('Informe todas os recursos')
    }

    const userExistent = await prisma.user.findFirst({
      where: { email }
    })

    if (!userExistent) {
      throw new AppError('E-mail sem permissão de cadastro!', 409)
    }

    if (userExistent.status === 'on') {
      throw new AppError('E-mail já registrado, clique em "Fazer login com o Google"')
    }

    const passwordHash = await hash(uidGoogle, 8)

    const result = await prisma.user.update({
      where: { email },
      data: {
        email, name: userName, password: passwordHash, uidGoogle, status: 'on', avatar_url
      }
    })

    return res.status(200).json(result)
  }
}