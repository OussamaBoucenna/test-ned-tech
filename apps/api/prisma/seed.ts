/**
 * Seed script — creates a default login user, the department & role catalogues,
 * and 20+ realistic employees linked to them.
 * Idempotent: re-running upserts the user/catalogues and only seeds employees
 * when the table is empty.
 *
 * Run with: npm run prisma:seed --workspace apps/api
 */
import { PrismaClient, EmployeeStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Customer Support',
];

const ROLES = [
  'Software Engineer',
  'Senior Engineer',
  'Engineering Manager',
  'QA Engineer',
  'Product Manager',
  'Product Owner',
  'Business Analyst',
  'UX Designer',
  'UI Designer',
  'Design Lead',
  'Marketing Specialist',
  'Content Writer',
  'Account Executive',
  'Sales Manager',
  'HR Generalist',
  'Recruiter',
  'Accountant',
  'Financial Analyst',
  'Support Agent',
  'Customer Success Manager',
];

const FIRST_NAMES = [
  'Olivia', 'Liam', 'Emma', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason',
  'Isabella', 'Lucas', 'Mia', 'Logan', 'Amelia', 'James', 'Harper',
  'Benjamin', 'Evelyn', 'Henry', 'Abigail', 'Alexander', 'Charlotte', 'Daniel',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez',
];

function pick<T>(items: T[], index: number): T {
  return items[index % items.length];
}

async function seedUser() {
  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { email: 'admin@example.com', name: 'Admin User', passwordHash },
  });
  console.log('Seeded user: admin@example.com / password123');
}

/** Upserts each name and returns a name → id map. */
async function seedCatalogue(
  names: string[],
  upsert: (name: string) => Promise<{ id: string; name: string }>,
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  for (const name of names) {
    const record = await upsert(name);
    map.set(record.name, record.id);
  }
  return map;
}

async function main() {
  await seedUser();

  const departments = await seedCatalogue(DEPARTMENTS, (name) =>
    prisma.department.upsert({ where: { name }, update: {}, create: { name } }),
  );
  const roles = await seedCatalogue(ROLES, (name) =>
    prisma.role.upsert({ where: { name }, update: {}, create: { name } }),
  );
  console.log(`Seeded ${departments.size} departments and ${roles.size} roles.`);

  const existing = await prisma.employee.count();
  if (existing > 0) {
    console.log(`Employees already present (${existing}); skipping employee seed.`);
    return;
  }

  const departmentIds = [...departments.values()];
  const roleIds = [...roles.values()];

  const employees = Array.from({ length: 22 }, (_, i) => {
    const firstName = pick(FIRST_NAMES, i);
    const lastName = pick(LAST_NAMES, i * 3 + 1);
    return {
      fullName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      departmentId: pick(departmentIds, i),
      roleId: pick(roleIds, i),
      // Roughly every 5th employee is inactive, for varied badges.
      status: i % 5 === 0 ? EmployeeStatus.INACTIVE : EmployeeStatus.ACTIVE,
    };
  });

  await prisma.employee.createMany({ data: employees });
  console.log(`Seeded ${employees.length} employees.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
