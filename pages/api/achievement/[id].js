import prisma from '@/lib/prisma';
import authMiddleware from '@/middlewares/authMiddleware';

const handler = async (req, res) => {
  const { method, body, query, user_id, student_id } = req;
  const { id } = query;
  switch (method) {
    case 'PUT':
      try {
        let { achievement, description, year } = body;
        const payload = { studentId: Number(student_id), achievement, description, year };
        const data = await prisma.achievement.update({
          where: { id: Number(id) },
          data: payload,
        });
        return res.status(201).json({ msg: 'success', data: data });
      } catch (error) {
        console.log('Error creating student:', error);
        return res.status(500).json({ msg: 'Terjadi masalah,  silahkan coba lagi', error });
      }
    case 'DELETE':
      try {
        await prisma.achievement.delete({
          where: { id: Number(id) },
        });
        return res.status(201).json({ msg: 'success' });
      } catch (error) {
        console.log('Error creating student:', error);
        return res.status(500).json({ msg: 'Terjadi masalah,  silahkan coba lagi', error });
      }
    default:
      return res.status(405).json({ msg: 'Method not allowed' });
  }
};

export default authMiddleware(handler);
