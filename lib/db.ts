import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

// Add logging for development and debugging
const prismaOptions = {
  log: [
    { level: "error", emit: "event" },
    { level: "warn", emit: "event" },
    { level: "info", emit: "event" },
    { level: "query", emit: "event" },
  ] as const,
}

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient(
    process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test"
      ? prismaOptions
      : undefined
  )

// Log Prisma events
if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
  prisma.$on("error", (e) => {
    console.error("Prisma error:", e)
  })
  
  prisma.$on("warn", (e) => {
    console.warn("Prisma warning:", e)
  })
  
  prisma.$on("info", (e) => {
    console.info("Prisma info:", e)
  })
  
  prisma.$on("query", (e) => {
    console.log("Prisma query:", e)
  })
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export default prisma
