import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middleware/errorHandler.js';
import ordersRouter from './routes/orderRouter.js';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/v1/api/orders', ordersRouter);

app.use(errorHandler);

const cleanup = async () => {
  console.log('Cleaning up...');
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);

export { app, prisma };

