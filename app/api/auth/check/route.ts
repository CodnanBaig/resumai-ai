import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { verifySessionToken } from "@/lib/auth"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("session")?.value
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
    await verifySessionToken(session)
    return NextResponse.json({ authenticated: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}

