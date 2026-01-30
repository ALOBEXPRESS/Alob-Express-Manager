import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    
    console.log(`Clearing ${allCookies.length} cookies from server`);
    
    // Delete all cookies
    allCookies.forEach((cookie) => {
      cookieStore.delete(cookie.name);
    });
    
    return NextResponse.json({ 
      ok: true, 
      cleared: allCookies.length 
    });
  } catch (error) {
    console.error('Error clearing cookies:', error);
    return NextResponse.json({ 
      ok: false, 
      error: error.message 
    }, { status: 500 });
  }
}
