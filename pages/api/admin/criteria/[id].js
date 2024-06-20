import prisma from '@/lib/prisma';
import authAdminMiddleware from '@/middlewares/authAdminMiddleware';

const handler = async (req, res) => {
  const { method, body, query, user_id, student_id } = req;
  const { id } = query;
  switch (method) {
    case 'PUT':
      try {
        let { weightValue, maxValue } = body;
        const payload = { ...body, weightValue: Number(weightValue), maxValue: Number(maxValue) };
        const data = await prisma.criteria.update({
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
        await prisma.criteria.delete({
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

export default authAdminMiddleware(handler);
