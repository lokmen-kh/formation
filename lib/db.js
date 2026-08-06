import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis;

let db;

if (!globalForPrisma.prisma) {
  // 1. Création d'un pool de connexion standard PostgreSQL
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
  });
  
  // 2. Initialisation de l'adaptateur de pilote exigé par Prisma 7
  const adapter = new PrismaPg(pool);
  
  // 3. Instanciation du client Prisma avec l'adaptateur
  db = new PrismaClient({ adapter });
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = db;
  }
} else {
  db = globalForPrisma.prisma;
}

export { db };