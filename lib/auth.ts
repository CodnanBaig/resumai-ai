import { SignJWT, jwtVerify } from "jose"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"

const alg = "HS256"

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error("JWT_SECRET not set")
  return new TextEncoder().encode(secret)
}

export async function hashPassword(plain: string) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(plain, salt)
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash)
}

export async function createSessionToken(payload: { userId: string; email: string }) {
  const secret = getJwtSecret()
  return new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret)
}

export async function verifySessionToken(token: string) {
  const secret = getJwtSecret()
  const { payload } = await jwtVerify(token, secret)
  return payload as { userId: string; email: string; iat: number; exp: number }
}

export async function getUserFromSessionCookie(cookieHeader?: string) {
  if (!cookieHeader) return null
  const match = /session=([^;]+)/.exec(cookieHeader)
  if (!match) return null
  try {
    const payload = await verifySessionToken(match[1])
    const user = await prisma.user.findUnique({ where: { id: payload.userId } })
    return user
  } catch {
    return null
  }
}
