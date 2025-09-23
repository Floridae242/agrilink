import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/auth.js';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

function hashApiKey(apiKey: string): string {
  return createHash('sha256').update(apiKey).digest('hex');
}

async function main() {
  console.log('🌱 Seeding database...');

  // Create users with different roles
  const farmer = await prisma.user.upsert({
    where: { email: 'farmer@agrilink.local' },
    update: {},
    create: {
      email: 'farmer@agrilink.local',
      name: 'John Farmer',
      password: await hashPassword('password123'),
      role: 'FARMER',
    },
  });

  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@agrilink.local' },
    update: {},
    create: {
      email: 'buyer@agrilink.local',
      name: 'Jane Buyer',
      password: await hashPassword('password123'),
      role: 'BUYER',
    },
  });

  const inspector = await prisma.user.upsert({
    where: { email: 'inspector@agrilink.local' },
    update: {},
    create: {
      email: 'inspector@agrilink.local',
      name: 'Mike Inspector',
      password: await hashPassword('password123'),
      role: 'INSPECTOR',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@agrilink.local' },
    update: {},
    create: {
      email: 'admin@agrilink.local',
      name: 'Sarah Admin',
      password: await hashPassword('password123'),
      role: 'ADMIN',
    },
  });

  console.log('✅ Users created:', { farmer: farmer.id, buyer: buyer.id, inspector: inspector.id, admin: admin.id });

  // Create farms
  const farms = await Promise.all([
    prisma.farm.upsert({
      where: { id: 'farm-1' },
      update: {},
      create: {
        id: 'farm-1',
        name: 'Green Valley Farm',
        district: 'Chiang Mai',
        ownerId: farmer.id,
      },
    }),
    prisma.farm.upsert({
      where: { id: 'farm-2' },
      update: {},
      create: {
        id: 'farm-2',
        name: 'Organic Hills',
        district: 'Chiang Rai',
        ownerId: farmer.id,
      },
    }),
    prisma.farm.upsert({
      where: { id: 'farm-3' },
      update: {},
      create: {
        id: 'farm-3',
        name: 'Smart Agriculture Co.',
        district: 'Nakhon Pathom',
        ownerId: farmer.id,
      },
    }),
  ]);

  console.log('✅ Farms created:', farms.length);

  // Create lots for each farm
  const lots = [];
  const produces = ['Tomatoes', 'Lettuce', 'Cucumbers', 'Bell Peppers', 'Carrots'];

  for (const farm of farms) {
    for (let i = 0; i < 5; i++) {
      const publicId = `LOT-${farm.name.replace(/\s+/g, '').toUpperCase()}-${i + 1}`;
      const lot = await prisma.lot.upsert({
        where: { publicId },
        update: {},
        create: {
          publicId,
          farmId: farm.id,
          produce: produces[i],
        },
      });
      lots.push(lot);
    }
  }

  // Create special demo lot for IoT testing
  const demoLot = await prisma.lot.upsert({
    where: { publicId: 'DEMOLOT' },
    update: {},
    create: {
      publicId: 'DEMOLOT',
      farmId: farms[0].id,
      produce: 'Demo Tomatoes (IoT)',
    },
  });
  lots.push(demoLot);

  console.log('✅ Lots created:', lots.length);

  // Create events for each lot
  const eventTypes = ['PLANTED', 'WATERED', 'FERTILIZED', 'HARVESTED', 'PACKAGED', 'SHIPPED'];
  let totalEvents = 0;

  for (const lot of lots) {
    const numEvents = Math.floor(Math.random() * 4) + 3; // 3-6 events per lot
    
    for (let i = 0; i < numEvents; i++) {
      const daysAgo = numEvents - i;
      const eventDate = new Date();
      eventDate.setDate(eventDate.getDate() - daysAgo);

      await prisma.event.create({
        data: {
          lotId: lot.id,
          type: eventTypes[i % eventTypes.length],
          note: `${eventTypes[i % eventTypes.length]} event for ${lot.produce}`,
          temp: Math.random() * 10 + 15, // 15-25°C
          hum: Math.random() * 30 + 50, // 50-80%
          at: eventDate,
          place: `Field Section ${Math.floor(Math.random() * 5) + 1}`,
        },
      });
      totalEvents++;
    }
  }

  console.log('✅ Events created:', totalEvents);

  // Create some shipments
  const shipments = [];
  for (let i = 0; i < 5; i++) {
    const randomLot = lots[Math.floor(Math.random() * lots.length)];
    const shipment = await prisma.shipment.create({
      data: {
        lotId: randomLot.id,
        status: ['IN_TRANSIT', 'DELIVERED', 'PENDING'][Math.floor(Math.random() * 3)],
        route: `Route ${i + 1}: Farm → Distribution Center → Market`,
      },
    });
    shipments.push(shipment);
  }

  console.log('✅ Shipments created:', shipments.length);

  // Create demo sensor device
  const demoApiKey = 'DEMO_IOT_KEY_123';
  const demoDevice = await prisma.sensorDevice.upsert({
    where: { apiKeyHash: hashApiKey(demoApiKey) },
    update: {},
    create: {
      name: 'Demo Temperature Sensor',
      apiKeyHash: hashApiKey(demoApiKey),
      boundLotId: demoLot.id,
    },
  });

  console.log('✅ Demo sensor device created:', demoDevice.name);

  console.log('🎉 Seeding completed successfully!');
  console.log('\n📋 Test credentials:');
  console.log('Farmer: farmer@agrilink.local / password123');
  console.log('Buyer: buyer@agrilink.local / password123');
  console.log('Inspector: inspector@agrilink.local / password123');
  console.log('Admin: admin@agrilink.local / password123');
  console.log('\n🔑 IoT API Keys:');
  console.log('Demo Device API Key:', demoApiKey);
  console.log('Demo Lot Public ID: DEMOLOT');
  console.log('Master IoT Key: MASTER_IOT_KEY_CHANGE_IN_PRODUCTION');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });