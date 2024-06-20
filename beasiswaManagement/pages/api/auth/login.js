import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ msg: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Email and password are required' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email, role: 'student' },
      include: {
        student: true,
      },
    });

    if (!user) {
      return res.status(401).json({ msg: 'Email atau password salah' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ msg: 'Email atau password salah' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        student_id: user.student.id,
      },
      JWT_SECRET,
      { expiresIn: '6h' }
    );

    return res.status(200).json({
      msg: 'Berhasil login',
      token,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        student_id: user.student.id,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Terjadi masalah,  silahkan coba lagi' });
  }
}
