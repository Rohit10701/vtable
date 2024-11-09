import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const TOTAL_ORDERS = 10000;
const BATCH_SIZE = 100;
const MAX_ITEMS_PER_ORDER = 5;

const generateOrderItem = () => ({
  name: faker.commerce.productName(),
  quantity: faker.number.int({ min: 1, max: 10 }),
  price: parseFloat(faker.commerce.price({ min: 10, max: 500 }))
});

const generateOrder = () => {
  const items = Array.from(
    { length: faker.number.int({ min: 1, max: MAX_ITEMS_PER_ORDER }) },
    generateOrderItem
  );
  
  const orderAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  return {
    customerName: faker.person.fullName(),
    orderAmount,
    status: faker.helpers.arrayElement(['pending', 'processing', 'completed', 'cancelled']),
    createdAt: faker.date.past({ years: 1 }),
    items: {
      create: items
    }
  };
};

const seed = async () => {
  console.log('Starting seed...');
  
  try {
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    
    const batches = Math.ceil(TOTAL_ORDERS / BATCH_SIZE);
    
    for (let i = 0; i < batches; i++) {
      const batchOrders = Array.from(
        { length: Math.min(BATCH_SIZE, TOTAL_ORDERS - i * BATCH_SIZE) },
        generateOrder
      );
      
      await Promise.all(
        batchOrders.map(order => 
          prisma.order.create({
            data: order
          })
        )
      );
      
      console.log(`Processed batch ${i + 1}/${batches}`);
    }
    
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

seed();