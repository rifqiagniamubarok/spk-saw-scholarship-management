import prisma from '@/lib/prisma';
import authAdminMiddleware from '@/middlewares/authAdminMiddleware';

const handler = async (req, res) => {
  const { method, body, query, user_id } = req;

  switch (method) {
    case 'GET':
      try {
        const criterias = await prisma.criteria.findMany();
        return res.status(200).json({ msg: 'success', data: criterias });
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
