import prisma from '@/lib/prisma';
import authAdminMiddleware from '@/middlewares/authAdminMiddleware';
import SendEmail from '@/utils/SendEmail';
import TemplateEmail from '@/utils/TemplateEmail';

const handler = async (req, res) => {
  const { method, body, query, user_id, params } = req;

  switch (method) {
    case 'POST':
      try {
        let studentId = Number(query.id);
        let { status } = body;
        if (status !== 'accepted' && status !== 'rejected') {
          return res.status(400).json({ msg: 'status must be accpeted or rejected' });
        }

        const student = await prisma.student.update({
          where: { id: studentId, evaluationStatus: 'process' },
          data: {
            evaluationStatus: status,
          },
          include: {
            user: true,
          },
        });

        SendEmail({
          to: student.user.email,
          subject: `Your scholarship request is ${status}`,
          html: TemplateEmail(`Dear ${student.firstName}, Your request for scholarship is ${status}`),
        });

        return res.status(201).json({ msg: 'success' });
      } catch (error) {
        console.log('Error creating student:', error);
        return res.status(500).json({ msg: 'Terjadi masalah,  silahkan coba lagi' });
      }

    default:
      return res.status(405).json({ msg: 'Method not allowed' });
  }
};

export default authAdminMiddleware(handler);
