// /pages/api/students.js

import prisma from '@/lib/prisma';
import authMiddleware from '@/middlewares/authMiddleware';
import { user } from '@nextui-org/react';

const handler = async (req, res) => {
  const { method, body, query, user_id } = req;

  switch (method) {
    case 'GET':
      try {
        const user = await prisma.user.findUnique({
          where: { id: parseInt(user_id) },
          include: {
            student: { include: { grades: true } },
          },
        });

        let ableToRequest = true;

        let data = user.student;

        let studentCheck = {};
        for (const key in data) {
          if (key !== 'grades') {
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

        return res.status(200).json({ msg: 'success', data: { ...user, ableToRequest } });
      } catch (error) {
        console.error('Error fetching student:', error);
        return res.status(500).json({ message: 'Terjadi masalah,  silahkan coba lagi' });
      }

    case 'PUT':
      try {
        let {
          username,
          email,
          address,
          dob,
          evaluationStatus,
          fatherIncome,
          fatherJob,
          fatherName,
          firstName,
          gender,
          lastName,
          motherIncome,
          motherJob,
          motherName,
          nim,
          pob,
          userId,
          id: student_id,
        } = body;

        let studentPayload = {
          address,
          evaluationStatus,
          fatherIncome: Number(fatherIncome),
          fatherJob,
          fatherName,
          firstName,
          gender,
          lastName,
          motherIncome: Number(motherIncome),
          motherJob,
          motherName,
          nim: Number(nim),
          pob,
          dob,
        };

        let userPayload = { email, username };

        const updatedUser = await prisma.user.update({
          where: { id: parseInt(user_id) },
          data: { ...userPayload, student: { update: studentPayload } },
        });
        return res.status(200).json({ msg: 'success', data: updatedUser });
      } catch (error) {
        console.error('Error updating student:', error);
        return res.status(500).json({ msg: 'Terjadi masalah,  silahkan coba lagi', error });
      }

    case 'POST':
      let payload = {};
      try {
        payload = { ...body, user_id: parseInt(user_id), gpa: 3.2 };
        const newStudent = await prisma.student.create({
          data: payload,
        });
        return res.status(201).json({ student: newStudent });
      } catch (error) {
        console.log('Error creating student:', error, payload);
        return res.status(500).json({ msg: 'Terjadi masalah,  silahkan coba lagi' });
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
};

export default authMiddleware(handler);
