import { NextResponse } from 'next/server'

export async function updateSession(request) {
  return NextResponse.next({ request })
}
