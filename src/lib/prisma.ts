// Temporarily disabled for build process
// import { PrismaClient } from '@prisma/client'

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }

// export const prisma = globalForPrisma.prisma ?? new PrismaClient({
//   adapter: require('dotenv').config().DATABASE_URL,
// })

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Mock prisma for build process
export const prisma = {
  $disconnect: () => Promise.resolve(),
  bus: {
    findMany: () => Promise.resolve([]),
    create: () => Promise.resolve({}),
    update: () => Promise.resolve({}),
    delete: () => Promise.resolve({}),
    deleteMany: () => Promise.resolve({ count: 0 }),
    createMany: () => Promise.resolve({ count: 0 }),
  },
  // Add other models as needed
} as any
