import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { uuidv7 } from 'uuidv7';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@admin.com' },
    update: {},
    create: {
      identity: uuidv7(),
      name: 'Admin',
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('Seed completed:', admin.email, admin.identity);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
