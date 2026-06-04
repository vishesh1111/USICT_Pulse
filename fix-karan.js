const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'karan@gmail.com' },
    update: {
      role: 'SENIOR',
      fullName: 'Karan',
    },
    create: {
      email: 'karan@gmail.com',
      fullName: 'Karan',
      role: 'SENIOR',
      branch: 'CSE',
      year: 4,
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karan',
      seniorScore: 90
    }
  });
  console.log("Successfully added/updated karan@gmail.com:", user);
}
main().catch(console.error).finally(() => prisma.$disconnect());
