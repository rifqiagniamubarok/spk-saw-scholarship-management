import prisma from '@/lib/prisma';
import authMiddleware from '@/middlewares/authMiddleware';

const handler = async (req, res) => {
  const { method, body, query, user_id, student_id } = req;

  switch (method) {
    case 'GET':
      try {
        const achievements = await prisma.achievement.findMany({
          where: { studentId: parseInt(student_id) },
          orderBy: [
            {
              year: 'asc',
            },
          ],
        });

        return res.status(200).json({ msg: 'success', data: achievements });
      } catch (error) {
        console.error('Error fetching student:', error);
        return res.status(500).json({ message: 'Terjadi masalah,  silahkan coba lagi' });
      }

    case 'POST':
      try {
        let { achievement, description, year } = body;
        const payload = { studentId: Number(student_id), achievement, description, year };
        const data = await prisma.achievement.create({
          data: payload,
        });
        return res.status(201).json({ msg: 'success', data: payload });
      } catch (error) {
        console.log('Error creating student:', error);
        return res.status(500).json({ msg: 'Terjadi masalah,  silahkan coba lagi' });
      }

    default:
      return res.status(405).json({ msg: 'Method not allowed' });
  }
};

export default authMiddleware(handler);
