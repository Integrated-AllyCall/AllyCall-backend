import prisma from '../src/configs/prisma';
import { countries as allCountries } from 'countries-list';

const seedCountries = async () => {
  const entries = Object.entries(allCountries);

  for (const [code, data] of entries) {
    await prisma.countries.upsert({
      where: { code },
      update: {}, // do nothing if already exists
      create: {
        code,
        name: data.name,
      },
    });
  }

  console.log(`Seeded ${entries.length} countries.`);
  await prisma.$disconnect();
};

seedCountries().catch((e) => {
  console.error('Seeding error:', e);
  prisma.$disconnect();
  process.exit(1);
});
