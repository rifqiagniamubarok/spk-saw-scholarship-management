const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');

async function main() {
  let payload = {
    username: 'admin',
    email: 'admin@admin.com',
    password: 'adminadmin',
    role: 'admin',
  };

  let payloadCriteria = {
    name: 'IPK',
    weightValue: 20,
    maxValue: 4,
  };

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const alice = await prisma.user.upsert({
    where: { email: payload.email },
    update: {},
    create: {
      email: payload.email,
      username: payload.username,
      role: payload.role,
      password: hashedPassword,
    },
  });

  const ipk = await prisma.criteria.upsert({
    where: { name: payloadCriteria.name },
    update: {},
    create: {
      name: payloadCriteria.name,
      weightValue: payloadCriteria.weightValue,
      maxValue: payloadCriteria.maxValue,
    },
  });

  console.log({ alice, ipk });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
