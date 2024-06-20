import prisma from '@/lib/prisma';
import authAdminMiddleware from '@/middlewares/authAdminMiddleware';
import SendEmail from '@/utils/SendEmail';
import TemplateEmail from '@/utils/TemplateEmail';

const handler = async (req, res) => {
  const { method, body, query, user_id, params } = req;

  switch (method) {
    case 'GET':
      try {
        let studentId = Number(query.id);
        const criterias = await prisma.criteria.findMany();
        let totalWeightValues = 0;
        if (criterias.length != 0) {
          let total = criterias.reduce((accumulator, currentValue) => {
            return accumulator + Number(currentValue.weightValue);
          }, 0);
          totalWeightValues = total;
        } else {
          return res.status(400).json({ msg: 'Criteria does not exist' });
        }

        if (totalWeightValues !== 100) {
          return res.status(400).json({ msg: 'Criteria is not 100% ' });
        }

        const payloaEvaluations = criterias.map(({ id, name, weightValue, maxValue }) => {
          return {
            criteriaId: id,
            criteriaName: name,
            criteriaWeightValue: weightValue,
            criteriaMaxValue: maxValue,
            weightValue: weightValue / 100,
            value: null,
            criteriaResult: null,
            result: null,
          };
        });

        // const student = await prisma.student.update({
        //   where: { id: studentId },
        //   data: { evaluationStatus: 'process', evaluations: { create: payloaEvaluations } },
        //   include: {
        //     evaluations: true,
        //   },
        // });

        return res.status(201).json({ msg: 'success', data: payloaEvaluations });
      } catch (error) {
        console.log('Error creating student:', error);
        return res.status(500).json({ msg: 'Terjadi masalah,  silahkan coba lagi' });
      }
    case 'POST':
      try {
        let studentId = Number(query.id);
        let { evaluations } = body;
        const criterias = await prisma.criteria.findMany();
        let totalWeightValues = 0;
        if (criterias.length != 0) {
          let total = criterias.reduce((accumulator, currentValue) => {
            return accumulator + Number(currentValue.weightValue);
          }, 0);
          totalWeightValues = total;
        } else {
          return res.status(400).json({ msg: 'Criteria does not exist' });
        }

        if (totalWeightValues !== 100) {
          return res.status(400).json({ msg: 'Criteria is not 100% ' });
        }

        const payloaEvaluations = evaluations.map((item, index) => {
          let { criteriaId, criteriaName, criteriaWeightValue, criteriaMaxValue, weightValue, value, criteriaResult, result } = item;
          let criRes = Number(value) / criteriaMaxValue;
          let res = criRes * weightValue;
          return {
            criteriaId,
            criteriaName,
            criteriaWeightValue,
            criteriaMaxValue,
            weightValue,
            value: Number(value),
            criteriaResult: criRes,
            result: res,
          };
        });

        let totalPoint = payloaEvaluations.reduce((accumulator, currentValue) => {
          return accumulator + Number(currentValue.result);
        }, 0);

        const student = await prisma.student.update({
          where: { id: studentId },
          data: {
            evaluationStatus: 'process',
            evaluationPoint: totalPoint,
            evaluations: { create: payloaEvaluations },
          },
          include: {
            evaluations: true,
            user: true,
          },
        });

        SendEmail({
          to: student.user.email,
          subject: `Your scholarship request in process`,
          html: TemplateEmail(`Dear ${student.firstName}, Your request for scholarship in process`),
        });

        return res.status(201).json({ msg: 'success', data: student });
      } catch (error) {
        console.log('Error creating student:', error);
        return res.status(500).json({ msg: 'Terjadi masalah,  silahkan coba lagi' });
      }

    default:
      return res.status(405).json({ msg: 'Method not allowed' });
  }
};

export default authAdminMiddleware(handler);
