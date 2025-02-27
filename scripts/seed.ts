import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Créer un utilisateur de test
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Utilisateur Test',
      role: UserRole.EMPLOYEE,
      department: 'IT'
    }
  });

  console.log('Utilisateur de test créé:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 