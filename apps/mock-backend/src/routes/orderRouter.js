import { Router } from 'express';
import { prisma } from '../app.js';
import { validateQueryParams } from '../middleware/validation.js';

const router = Router();

  const getOrders =  async (req, res, next) => {
    try {
      const { cursor, limit, sort, sortDirection } = req.validatedQuery;
      const take = parseInt(limit) + 1;

      const totalCount = !cursor ? await prisma.order.count() : undefined;

      const orders = await prisma.order.findMany({
        take,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: { [sort]: sortDirection },
        include: {
          items: true
        }
      });

      const hasMore = orders.length > limit;
      const data = hasMore ? orders.slice(0, -1) : orders;
      const nextCursor = hasMore ? data[data.length - 1].id : null;

      res.json({
        data,
        nextCursor,
        totalCount
      });
    } catch (error) {
      next(error);
    }
  }

router.get('/', validateQueryParams, getOrders);

export default router;