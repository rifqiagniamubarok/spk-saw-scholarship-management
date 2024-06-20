import prisma from '@/lib/prisma';
import authMiddleware from '@/middlewares/authMiddleware';

const handler = async (req, res) => {
  const { method, body, query, user_id, student_id } = req;

  switch (method) {
    case 'POST':
      try {
        const data = await prisma.student.findUnique({
          where: { id: Number(student_id), evaluationStatus: 'not_sent' },
          include: {
            achievements: true,
            grades: true,
          },
        });

        let ableToRequest = true;

        let studentCheck = {};
        for (const key in data) {
          if (key !== 'achievements' && key !== 'grades') {
            studentCheck[key] = data[key];
          }
        }

        for (const key in studentCheck) {
          if (studentCheck[key] == null) {
            ableToRequest = false;
          }
        }

        if (data.grades.length == 0) {
          ableToRequest = false;
        }

        if (ableToRequest) {
          await prisma.student.update({
            where: {
              id: Number(student_id),
            },
            data: {
              evaluationStatus: 'request',
            },
          });
        }

        return res.status(201).json({ msg: 'success', data: { ...studentCheck, ableToRequest } });
      } catch (error) {
        console.log('Error creating student:', error);
        return res.status(500).json({ msg: 'Terjadi masalah,  silahkan coba lagi' });
      }

    default:
      return res.status(405).json({ msg: 'Method not allowed' });
  }
};

export default authMiddleware(handler);
