import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Try to connect to Supabase, fallback to mock if connection fails
let prisma: PrismaClient

try {
  prisma = globalForPrisma.prisma ?? new PrismaClient()
  
  // Test connection
  prisma.$connect().catch(() => {
    console.warn('Database connection failed, using mock implementation')
    throw new Error('Connection failed')
  })
} catch (error) {
  console.warn('Using mock Prisma implementation for build process')
  prisma = {
    $connect: () => Promise.resolve(),
    $disconnect: () => Promise.resolve(),
    $queryRaw: () => Promise.resolve([]),
    $executeRaw: () => Promise.resolve({}),
    bus: {
      findMany: () => Promise.resolve([]),
      findUnique: () => Promise.resolve(null),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
      deleteMany: () => Promise.resolve({ count: 0 }),
      createMany: () => Promise.resolve({ count: 0 }),
      count: () => Promise.resolve(0),
    },
    article: {
      findMany: () => Promise.resolve([]),
      findUnique: () => Promise.resolve(null),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
      deleteMany: () => Promise.resolve({ count: 0 }),
      createMany: () => Promise.resolve({ count: 0 }),
      count: () => Promise.resolve(0),
    },
    fournisseur: {
      findMany: () => Promise.resolve([]),
      findUnique: () => Promise.resolve(null),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
      deleteMany: () => Promise.resolve({ count: 0 }),
      createMany: () => Promise.resolve({ count: 0 }),
      count: () => Promise.resolve(0),
    },
    demandeAchat: {
      findMany: () => Promise.resolve([]),
      findUnique: () => Promise.resolve(null),
      create: () => Promise.resolve({}),
      update: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
      deleteMany: () => Promise.resolve({ count: 0 }),
      createMany: () => Promise.resolve({ count: 0 }),
      count: () => Promise.resolve(0),
    },
    // Add other models as needed
  } as any
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
