// pages/api/register.js

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import Joi from 'joi';

const requestValidation = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  nim: Joi.number(),
  username: Joi.string(),
  email: Joi.string(),
  password: Joi.string(),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method not allowed' });
  }

  try {
    const {
      value: { firstName, lastName, nim, username, email, password },
    } = await requestValidation.validate(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ msg: 'Email is already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        student: {
          create: {
            firstName,
            lastName,
            nim,
          },
        },
      },
      include: {
        student: true,
      },
    });

    return res.status(201).json({
      msg: 'User created',
      // data: {
      //   id: newUser.id,
      //   firstName: newStudent.first_name,
      //   lastName: newStudent.last_name,
      //   nim: newStudent.nim,
      //   username: newUser.username,
      //   email: newUser.email,
      //   role: newUser.role,
      // },
      newUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Terjadi masalah,  silahkan coba lagi', error });
  }
}
