import prisma from '@/lib/prisma';
import authAdminMiddleware from '@/middlewares/authAdminMiddleware';

const handler = async (req, res) => {
  const { method, body, query, user_id, params } = req;

  switch (method) {
    case 'GET':
      try {
        const { page = 1, pageSize = 10 } = req.query;

        const skip = (page - 1) * pageSize;
        const take = parseInt(pageSize);

        const students = await prisma.student.findMany({
          orderBy: [
            {
              updatedAt: 'desc',
            },
          ],
          skip: skip,
          take: take,
        });
        const totalStudents = await prisma.student.count();
        const request = await prisma.student.count({
          where: {
            evaluationStatus: 'request',
          },
        });
        const accepted = await prisma.student.count({
          where: {
            evaluationStatus: 'accepted',
          },
        });
        const rejected = await prisma.student.count({
          where: {
            evaluationStatus: 'rejected',
          },
        });

        const maxPage = Math.ceil(totalStudents / pageSize);
        let info = { total: totalStudents, request, accepted, rejected, maxPage };
        return res.status(200).json({ msg: 'success', data: students, info });
      } catch (error) {
        console.error('Error fetching student:', error);
        return res.status(500).json({ message: 'Terjadi masalah,  silahkan coba lagi' });
      }

    default:
      return res.status(405).json({ msg: 'Method not allowed' });
  }
};

export default authAdminMiddleware(handler);
