/**
 * Authentication utilities
 * Simple JWT-based authentication for admin panel
 */

import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production-env"
)

export interface AdminCredentials {
  id: string
  email: string
  name: string
  role: "admin" | "superadmin"
  iat?: number
  exp?: number
}

/**
 * Create JWT token for admin
 */
export async function createToken(credentials: AdminCredentials): Promise<string> {
  const token = await new SignJWT(credentials)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET)

  return token
}

/**
 * Verify JWT token
 */
export async function verifyToken(token: string): Promise<AdminCredentials | null> {
  try {
    const verified = await jwtVerify(token, SECRET)
    return verified.payload as AdminCredentials
  } catch (error) {
    return null
  }
}

/**
 * Get admin from cookies
 */
export async function getAdminFromCookies(): Promise<AdminCredentials | null> {
  try {
    const cookieStore = cookies()
    const token = (await cookieStore).get("adminToken")?.value

    if (!token) {
      return null
    }

    return verifyToken(token)
  } catch (error) {
    return null
  }
}

/**
 * Set admin token in cookies
 */
export async function setAdminCookie(token: string): Promise<void> {
  const cookieStore = cookies()
  ;(await cookieStore).set("adminToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  })
}

/**
 * Clear admin token from cookies
 */
export async function clearAdminCookie(): Promise<void> {
  const cookieStore = cookies()
  ;(await cookieStore).delete("adminToken")
}

/**
 * Verify admin credentials against environment variables
 * Store multiple admins in env as: ADMIN_CREDENTIALS=admin1:password1,admin2:password2
 */
export function verifyCredentials(email: string, password: string): AdminCredentials | null {
  const adminCredentials = process.env.ADMIN_CREDENTIALS || ""

  const admins = adminCredentials.split(",").map((admin) => {
    const [adminEmail, adminPassword, adminName, role] = admin.split(":")
    return {
      email: adminEmail?.trim(),
      password: adminPassword?.trim(),
      name: adminName?.trim() || "Admin",
      role: (role?.trim() || "admin") as "admin" | "superadmin",
    }
  })

  const admin = admins.find(
    (a) => a.email === email.toLowerCase() && a.password === password
  )

  if (!admin) {
    return null
  }

  return {
    id: Buffer.from(admin.email).toString("base64"),
    email: admin.email,
    name: admin.name,
    role: admin.role,
  }
}

/**
 * Simple password hash (for demo - use bcrypt in production if needed)
 */
export function hashPassword(password: string): string {
  // In production, use bcryptjs
  return Buffer.from(password).toString("base64")
}

/**
 * Verify password hash
 */
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}
