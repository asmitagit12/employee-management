// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'asmita.patil@gmail.com';
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('admin123', 10);  // Set a strong password
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'ADMIN',
        firstName: 'Admin',
        lastName: 'Admin',
        username:'asmitapatil',
        mobile:'9090909090',
        designation:'admin'
      },
    });
    console.log('Admin user created');
  } else {
    console.log('Admin user already exists');
  }
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
