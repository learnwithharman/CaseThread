import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Cleaning up existing database records...');
  
  // Delete existing records in correct order to avoid constraint violations
  await prisma.subTask.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.note.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.tag.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('✅ Database clean complete.');
  console.log('🌱 Seeding mock data...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Standalone Tags
  const urgentTag = await prisma.tag.create({ data: { name: 'Urgent' } });
  const chemicalTag = await prisma.tag.create({ data: { name: 'Chemical' } });
  const observationTag = await prisma.tag.create({ data: { name: 'Observation' } });
  const evidenceTag = await prisma.tag.create({ data: { name: 'Evidence' } });
  const suspectTag = await prisma.tag.create({ data: { name: 'Suspect' } });
  const routineTag = await prisma.tag.create({ data: { name: 'Routine' } });

  // 2. Seed Dexter Morgan (theme: dexter)
  const dexter = await prisma.user.create({
    data: {
      name: 'Dexter Morgan',
      email: 'dexter@casethread.com',
      passwordHash,
      role: 'user',
      settings: {
        theme: 'dexter',
        language: 'en',
        shortcutsEnabled: true,
      },
    },
  });

  const dexterCat1 = await prisma.category.create({
    data: { userId: dexter.id, name: 'Target Profiling' },
  });
  const dexterCat2 = await prisma.category.create({
    data: { userId: dexter.id, name: 'Evidence Management' },
  });

  const dexterTask1 = await prisma.task.create({
    data: {
      userId: dexter.id,
      categoryId: dexterCat1.id,
      title: 'Analyze blood spatter slides',
      description: 'Review the spatter patterns from the latest crime scene on Harbor Boulevard.',
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      isFavorite: true,
      subtasks: {
        create: [
          { title: 'Compare angle of impact measurements', done: true },
          { title: 'Write up blood spatter lab report', done: false },
        ],
      },
      tags: {
        connect: [{ id: urgentTag.id }, { id: evidenceTag.id }],
      },
    },
  });

  const dexterTask2 = await prisma.task.create({
    data: {
      userId: dexter.id,
      categoryId: dexterCat2.id,
      title: 'Procure heavy-duty plastic sheeting',
      description: 'Acquire high-quality, clinical-grade plastic wraps from the store.',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      tags: {
        connect: [{ id: routineTag.id }],
      },
    },
  });

  await prisma.note.create({
    data: {
      userId: dexter.id,
      content: 'Observation: The suspect showed high anxiety during blood collection. Need to verify details.',
    },
  });

  await prisma.activity.create({
    data: {
      userId: dexter.id,
      type: 'created',
      details: 'Created case for Target Profiling: Analyze blood spatter slides',
    },
  });

  // 3. Seed Walter White (theme: breaking-bad)
  const walter = await prisma.user.create({
    data: {
      name: 'Walter White',
      email: 'walter@casethread.com',
      passwordHash,
      role: 'user',
      settings: {
        theme: 'breaking-bad',
        language: 'en',
        shortcutsEnabled: true,
      },
    },
  });

  const walterCat1 = await prisma.category.create({
    data: { userId: walter.id, name: 'Chemical Synthesis' },
  });
  const walterCat2 = await prisma.category.create({
    data: { userId: walter.id, name: 'Superlab Maintenance' },
  });

  await prisma.task.create({
    data: {
      userId: walter.id,
      categoryId: walterCat1.id,
      title: 'Synthesize Batch #37',
      description: 'Prepare the new reaction mixture using the updated purity indicators.',
      status: 'in-progress',
      priority: 'high',
      dueDate: new Date(),
      isFavorite: true,
      subtasks: {
        create: [
          { title: 'Check precursor stock level', done: true },
          { title: 'Verify reaction chamber pressure', done: true },
          { title: 'Synthesize crystalline solution', done: false },
        ],
      },
      tags: {
        connect: [{ id: chemicalTag.id }, { id: urgentTag.id }],
      },
    },
  });

  await prisma.task.create({
    data: {
      userId: walter.id,
      categoryId: walterCat2.id,
      title: 'Calibrate gas chromatograph',
      description: 'Calibrate the GC system in the lab to guarantee purity measurements.',
      status: 'completed',
      priority: 'medium',
      tags: {
        connect: [{ id: routineTag.id }],
      },
    },
  });

  await prisma.note.create({
    data: {
      userId: walter.id,
      content: 'Synthesis Formula Log: Methylamine ratio adjusted to 1.15 to stabilize crystallization.',
    },
  });

  // 4. Seed Patrick Jane (theme: mentalist)
  const patrick = await prisma.user.create({
    data: {
      name: 'Patrick Jane',
      email: 'patrick@casethread.com',
      passwordHash,
      role: 'user',
      settings: {
        theme: 'mentalist',
        language: 'en',
      },
    },
  });

  const patrickCat1 = await prisma.category.create({
    data: { userId: patrick.id, name: 'CBI Files' },
  });

  await prisma.task.create({
    data: {
      userId: patrick.id,
      categoryId: patrickCat1.id,
      title: 'Stalk Red John clues',
      description: 'Examine the crime scene patterns to figure out Red John\'s state of mind.',
      status: 'todo',
      priority: 'high',
      isFavorite: true,
      subtasks: {
        create: [
          { title: 'Analyze smiley logo signature paint composition', done: false },
          { title: 'Interview the witness at Sacramento Hotel', done: false },
        ],
      },
      tags: {
        connect: [{ id: urgentTag.id }, { id: suspectTag.id }],
      },
    },
  });

  await prisma.note.create({
    data: {
      userId: patrick.id,
      content: 'Observation: The victim was wearing a silver wedding band but there is no record of marriage. Suspect has something to hide.',
    },
  });

  // 5. Seed Sherlock Holmes (theme: sherlock)
  const sherlock = await prisma.user.create({
    data: {
      name: 'Sherlock Holmes',
      email: 'sherlock@casethread.com',
      passwordHash,
      role: 'user',
      settings: {
        theme: 'sherlock',
        language: 'en',
      },
    },
  });

  const sherlockCat = await prisma.category.create({
    data: { userId: sherlock.id, name: 'Crime Scenes' },
  });

  await prisma.task.create({
    data: {
      userId: sherlock.id,
      categoryId: sherlockCat.id,
      title: 'Analyze soil sample from 221B garden',
      description: 'Compare mud on the victim\'s boots with soil chemistry profiles across London.',
      status: 'todo',
      priority: 'medium',
      subtasks: {
        create: [
          { title: 'Separate organic residue under microscope', done: false },
          { title: 'Cross-reference with geological map of Westminster', done: false },
        ],
      },
      tags: {
        connect: [{ id: observationTag.id }],
      },
    },
  });

  await prisma.note.create({
    data: {
      userId: sherlock.id,
      content: 'Observation: The footprint depth suggests a man of 6ft 1in, weighing around 85kg, walking with a slight limp in the right foot.',
    },
  });

  // 6. Seed Jane Doe (theme: default)
  const defaultUser = await prisma.user.create({
    data: {
      name: 'Jane Doe',
      email: 'jane@casethread.com',
      passwordHash,
      role: 'user',
      settings: {
        theme: 'default',
        language: 'en',
      },
    },
  });

  const defaultCat = await prisma.category.create({
    data: { userId: defaultUser.id, name: 'Personal Tasks' },
  });

  await prisma.task.create({
    data: {
      userId: defaultUser.id,
      categoryId: defaultCat.id,
      title: 'Schedule weekly planning session',
      description: 'Review achievements of the week and plan milestones for next week.',
      status: 'todo',
      priority: 'low',
      tags: {
        connect: [{ id: routineTag.id }],
      },
    },
  });

  console.log('✅ Seeding database complete.');
  console.log(`
=========================================
  Seed Data Successfully Added!
  Credentials for Login (Password: password123):
  - Dexter:   dexter@casethread.com
  - Walter:   walter@casethread.com
  - Patrick:  patrick@casethread.com
  - Sherlock: sherlock@casethread.com
  - Default:  jane@casethread.com
=========================================
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
