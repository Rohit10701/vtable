import { z } from 'zod';

const querySchema = z.object({
  cursor: z.string().optional(),
  limit: z.string()
    .transform(Number)
    .pipe(z.number().int().min(1).max(100))
    .optional()
    .default('50'),
  sort: z.string().optional().default('createdAt'),
  sortDirection: z.enum(['asc', 'desc']).optional().default('desc')
});

export const validateQueryParams = (req, res, next) => {
  try {
    const validated = querySchema.parse(req.query);
    req.validatedQuery = validated;
    next();
  } catch (error) {
    next({
      status: 400,
      message: 'Invalid query parameters',
      details: error.errors
    });
  }
};

