# Virtual Table Implementation

A high-performance full-stack application that implements a virtual scrolling table with cursor-based pagination, handling a large dataset of 10,000 records. Built with Next.js, Node.js, and PostgreSQL.

## 🌟 Features

- Virtual scrolling with efficient DOM usage
- Cursor-based pagination
- Dynamic sorting on all columns
- Real-time data updates
- Performance optimized backend
- Type-safe implementation
- Comprehensive test coverage

## 🛠 Tech Stack

### Frontend
- Next.js 14
- TypeScript
- TanStack Query (React Query)
- TanStack Virtual
- Tailwind CSS

### Backend
- Node.js
- Express
- PostgreSQL
- Prisma ORM
- Zod (validation)

### DevOps
- Docker
- Lerna (monorepo)
- ESLint
- Prettier

## 📦 Project Structure

```
vtable/
├── apps/
│   ├── frontend/          # Next.js frontend 
│   └── mock-backend/      # Node.js backend application
├── docker-compose.yml     # Docker configuration
├── package.json          # Root package.json
└── lerna.json           # Lerna configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- Docker
- npm >= 8
- git

### Installation

1. Clone the repository
```bash
git clone https://github.com/Rohit10701/vtable.git
cd vtable
```

2. Install dependencies
```bash
# Install root dependencies and bootstrap packages
npm install
npm run bootstrap
```

3. Start the development environment
```bash
# Start PostgreSQL
npm run docker

# Start both frontend and backend
npm run dev
```

## 🛠 Development Commands

```bash
# Start development environment
npm run dev

# Build all packages
npm run build

# Run tests
npm run test

# Clean up node_modules
npm run clean

# Bootstrap packages
npm run bootstrap
```

## 📊 Database Management

```bash
# Access Prisma Studio
cd apps/mock-backend
npm run studio

# Run migrations
npm run migrate:dev

# Seed database
npm run seed
```

### Backend
- Cursor-based pagination for efficient data fetching
- Database indexing on frequently queried fields
- Request validation using Zod
- Proper error handling and logging
- Batched database operations

### Frontend
- Virtual scrolling to minimize DOM nodes
- Efficient re-renders using React Query
- Debounced sorting operations
- Memoized component renders
- Optimized bundle size

## 📝 API Documentation

### GET /api/orders
Fetch orders with pagination and sorting.

Query Parameters:
- `cursor`: string (optional) - Pagination cursor
- `limit`: number (default: 50) - Records per page
- `sort`: string - Field to sort by
- `sortDirection`: 'asc' | 'desc' - Sort direction

Response:
```typescript
interface OrdersResponse {
  data: Order[];
  nextCursor: string | null;
  totalCount: number;
}
```

## 🚧 Known Limitations

1. No filtering capabilities
2. No column resizing or reordering

## 🔄 Future Improvements

1. Add filtering capabilities
2. Implement column customization
3. Add row selection and bulk actions
4. Implement data export functionality
5. Make backend in ts
6. Implement retry mechanisms


## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 References

- [TanStack Query](https://tanstack.com/query/latest)
- [TanStack Virtual](https://tanstack.com/virtual/latest)
- [Prisma](https://www.prisma.io/)
- [Next.js](https://nextjs.org/)
