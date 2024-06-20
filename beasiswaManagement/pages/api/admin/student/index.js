import prisma from '@/lib/prisma';
import authAdminMiddleware from '@/middlewares/authAdminMiddleware';

const handler = async (req, res) => {
  const { method, body, query, user_id, params } = req;

  switch (method) {
    case 'GET':
      try {
        let getStatus = query.status.split(',');

        const status = getStatus.map((item) => {
          return {
            evaluationStatus: item,
          };
        });
        const students = await prisma.student.findMany({
          where: { OR: status },
          orderBy: [
            {
              evaluationPoint: 'desc',
            },
            {
              evaluationStatus: 'desc',
            },
          ],

          include: {
            evaluations: true,
          },
        });

        return res.status(200).json({ msg: 'success', data: students });
      } catch (error) {
        console.error('Error fetching student:', error);
        return res.status(500).json({ message: 'Terjadi masalah,  silahkan coba lagi' });
      }

    case 'POST':
      try {
        let { weightValue, maxValue } = body;
        const payload = { ...body, weightValue: Number(weightValue), maxValue: Number(maxValue) };
        const data = await prisma.criteria.create({
          data: payload,
        });
        return res.status(201).json({ msg: 'success', data: data });
      } catch (error) {
        console.log('Error creating student:', error);
        return res.status(500).json({ msg: 'Terjadi masalah,  silahkan coba lagi' });
      }

    default:
      return res.status(405).json({ msg: 'Method not allowed' });
  }
};

export default authAdminMiddleware(handler);
