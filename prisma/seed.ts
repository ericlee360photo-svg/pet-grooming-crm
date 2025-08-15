import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create master admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@barkbook.com' },
    update: {},
    create: {
      email: 'admin@barkbook.com',
      name: 'Master Admin',
      password: adminPassword,
      role: 'ADMIN',
      phone: '555-123-4567',
    },
  });

  // Create sample businesses with subscription data
  const business1 = await prisma.business.upsert({
    where: { slug: 'pawsome-pets' },
    update: {
      planTier: 'PRO',
      subscriptionStatus: 'ACTIVE',
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    },
    create: {
      name: 'Pawsome Pets Grooming',
      slug: 'pawsome-pets',
      email: 'info@pawsomepets.com',
      phone: '555-PAW-SOME',
      website: 'https://pawsomepets.com',
      address: '123 Dog Street',
      city: 'Pet City',
      state: 'CA',
      postal: '90210',
      description: 'Premium pet grooming services with love and care for your furry friends.',
      primaryColor: '#8b6d47',  // Warm brown
      accentColor: '#d4a574',   // Light brown
      active: true,
      bookingEnabled: true,
      planTier: 'PRO',
      subscriptionStatus: 'ACTIVE',
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    },
  });

  const business2 = await prisma.business.upsert({
    where: { slug: 'fluffy-friends' },
    update: {
      planTier: 'BASIC',
      subscriptionStatus: 'TRIALING',
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
    create: {
      name: 'Fluffy Friends Spa',
      slug: 'fluffy-friends',
      email: 'hello@fluffyfriends.com',
      phone: '555-FLUFFY',
      website: 'https://fluffyfriends.com',
      address: '456 Cat Avenue',
      city: 'Grooming Town',
      state: 'NY',
      postal: '10001',
      description: 'Luxury spa treatments for cats and dogs in a relaxing environment.',
      primaryColor: '#a67c9a',  // Soft purple
      accentColor: '#d4a4c8',   // Light purple
      active: true,
      bookingEnabled: true,
      planTier: 'BASIC',
      subscriptionStatus: 'TRIALING',
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
  });

  const business3 = await prisma.business.upsert({
    where: { slug: 'bark-and-bubbles' },
    update: {
      planTier: 'GROWTH',
      subscriptionStatus: 'ACTIVE',
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
    create: {
      name: 'Bark & Bubbles',
      slug: 'bark-and-bubbles',
      email: 'woof@barkandbubbles.com',
      phone: '555-BARK-123',
      website: 'https://barkandbubbles.com',
      address: '789 Puppy Lane',
      city: 'Dogville',
      state: 'TX',
      postal: '75001',
      description: 'Fun and friendly grooming for dogs of all sizes and breeds.',
      primaryColor: '#6a9bd1',  // Soft blue
      accentColor: '#89c4f4',   // Light blue
      active: true,
      bookingEnabled: true,
      planTier: 'GROWTH',
      subscriptionStatus: 'ACTIVE',
      trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  // Create groomer users
  const groomerPassword = await bcrypt.hash('groomer123', 10);
  
  const groomer1User = await prisma.user.upsert({
    where: { email: 'sarah@pawfect.com' },
    update: {},
    create: {
      email: 'sarah@pawfect.com',
      name: 'Sarah Johnson',
      password: groomerPassword,
      role: 'GROOMER',
      phone: '555-234-5678',
    },
  });

  const groomer2User = await prisma.user.upsert({
    where: { email: 'mike@pawfect.com' },
    update: {},
    create: {
      email: 'mike@pawfect.com',
      name: 'Mike Williams',
      password: groomerPassword,
      role: 'GROOMER',
      phone: '555-345-6789',
    },
  });

  // Create groomer profiles for different businesses
  const groomer1 = await prisma.groomer.create({
    data: {
      businessId: business1.id,
      userId: groomer1User.id,
      bio: 'Certified pet groomer with 8 years of experience. Specializes in show cuts and gentle handling.',
      active: true,
    },
  });

  const groomer2 = await prisma.groomer.create({
    data: {
      businessId: business2.id,
      userId: groomer2User.id,
      bio: 'Professional groomer specializing in large breeds and anxious pets.',
      active: true,
    },
  });

  // Create additional groomers for business3
  const groomer3User = await prisma.user.create({
    data: {
      email: 'alex@barkandbubbles.com',
      name: 'Alex Martinez',
      password: groomerPassword,
      role: 'GROOMER',
      phone: '555-456-7890',
    },
  });

  const groomer3 = await prisma.groomer.create({
    data: {
      businessId: business3.id,
      userId: groomer3User.id,
      bio: 'Energetic groomer who loves working with active dogs and puppies.',
      active: true,
    },
  });

  // Create services for each business
  const serviceTemplates = [
    {
      name: 'Basic Bath & Brush',
      description: 'Complete wash, dry, and brush out for your pet',
      priceCents: 4500, // $45.00
      active: true,
    },
    {
      name: 'Full Grooming Service',
      description: 'Complete grooming including bath, cut, nail trim, and ear cleaning',
      priceCents: 7500, // $75.00
      active: true,
    },
    {
      name: 'Premium Spa Package',
      description: 'Luxury treatment with premium shampoo, conditioning, styling, and aromatherapy',
      priceCents: 9500, // $95.00
      active: true,
    },
    {
      name: 'Nail Trim Only',
      description: 'Quick nail trimming service',
      priceCents: 1500, // $15.00
      active: true,
    },
    {
      name: 'De-shedding Treatment',
      description: 'Specialized treatment to reduce shedding with premium products',
      priceCents: 3500, // $35.00
      active: true,
    },
  ];

  // Create services for each business
  const businesses = [business1, business2, business3];
  for (const business of businesses) {
    for (const serviceTemplate of serviceTemplates) {
      await prisma.service.create({
        data: {
          ...serviceTemplate,
          businessId: business.id,
        },
      });
    }
  }

  // Create sample client user
  const clientPassword = await bcrypt.hash('client123', 10);
  const clientUser = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Smith',
      password: clientPassword,
      role: 'CLIENT',
      phone: '555-456-7890',
    },
  });

  // Create sample client for business1
  const client = await prisma.client.create({
    data: {
      businessId: business1.id,
      userId: clientUser.id,
      name: 'John Smith',
      email: 'john@example.com',
      phone: '555-456-7890',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      postal: '12345',
    },
  });

  // Create sample pet
  const existingPet = await prisma.pet.findFirst({
    where: {
      clientId: client.id,
      name: 'Buddy'
    }
  });

  if (!existingPet) {
    await prisma.pet.create({
      data: {
        clientId: client.id,
        name: 'Buddy',
        species: 'dog',
        breed: 'Golden Retriever',
        notes: 'Very friendly, loves treats',
      },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log('👤 Admin login: admin@pawfect.com / admin123');
  console.log('✂️ Groomer logins:');
  console.log('   - sarah@pawfect.com / groomer123');
  console.log('   - mike@pawfect.com / groomer123');
  console.log('   - alex@barkandbubbles.com / groomer123');
  console.log('🐕 Client login: john@example.com / client123');
  console.log('');
  console.log('🏢 Sample businesses created:');
  console.log('   - Pawsome Pets Grooming: /book/pawsome-pets');
  console.log('   - Fluffy Friends Spa: /book/fluffy-friends');
  console.log('   - Bark & Bubbles: /book/bark-and-bubbles');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
