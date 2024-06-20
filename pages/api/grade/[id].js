import prisma from '@/lib/prisma';
import authMiddleware from '@/middlewares/authMiddleware';

const handler = async (req, res) => {
  const { method, body, query, user_id, student_id } = req;
  const { id } = query;
  switch (method) {
    case 'PUT':
      try {
        let { cumulativeGpa, semester } = body;
        const payload = { studentId: student_id, cumulativeGpa: Number(cumulativeGpa), semester: Number(semester) };
        const data = await prisma.grade.update({
          where: { id: Number(id) },
          data: payload,
        });

        const grades = await prisma.grade.findMany({
          where: { studentId: Number(student_id) },
        });

        let GPA = Number(cumulativeGpa);

        if (grades.length != 0) {
          let allGrades = grades.reduce((accumulator, currentValue) => {
            return accumulator + Number(currentValue.cumulativeGpa);
          }, 0);
          GPA = allGrades / grades.length;
        }

        await prisma.student.update({
          where: { id: Number(student_id) },
          data: { gpa: GPA },
        });

        return res.status(201).json({ msg: 'success', data: data });
      } catch (error) {
        console.log('Error creating student:', error);
        return res.status(500).json({ msg: 'Terjadi masalah,  silahkan coba lagi', error });
      }
    case 'DELETE':
      try {
        await prisma.grade.delete({
          where: { id: Number(id) },
        });
        const grades = await prisma.grade.findMany({
          where: { studentId: Number(student_id) },
        });

        let GPA = Number(0);

        if (grades.length != 0) {
          let allGrades = grades.reduce((accumulator, currentValue) => {
            return accumulator + Number(currentValue.cumulativeGpa);
          }, 0);
          GPA = allGrades / grades.length;
        }

        await prisma.student.update({
          where: { id: Number(student_id) },
          data: { gpa: GPA },
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
