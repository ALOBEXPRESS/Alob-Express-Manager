import { supabaseAdmin } from "@/lib/supabase/admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    console.log("Validating admin status for user:", userId);

    // Check if user is admin (bypasses RLS)
    const { data: adminRow, error: adminError } = await supabaseAdmin
      .from("app_admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (adminError) {
      console.error("Admin check error:", adminError);
      return NextResponse.json({ 
        isAdmin: false, 
        isActive: false,
        error: adminError.message 
      }, { status: 500 });
    }

    const isAdmin = !!adminRow;
    console.log("Is admin:", isAdmin);

    // If not admin, check profile status
    if (!isAdmin) {
      const { data: profileRow, error: profileError } = await supabaseAdmin
        .from("users")
        .select("status")
        .eq("id", userId)
        .maybeSingle();

      if (profileError) {
        console.error("Profile check error:", profileError);
        return NextResponse.json({ 
          isAdmin: false, 
          isActive: false,
          error: profileError.message 
        }, { status: 500 });
      }

      const isActive = profileRow?.status === "active";
      console.log("Profile status:", profileRow?.status, "isActive:", isActive);

      return NextResponse.json({ 
        isAdmin: false, 
        isActive,
        status: profileRow?.status 
      });
    }

    return NextResponse.json({ 
      isAdmin: true, 
      isActive: true 
    });
  } catch (error) {
    console.error("Validate user error:", error);
    return NextResponse.json({ 
      isAdmin: false, 
      isActive: false,
      error: error.message 
    }, { status: 500 });
  }
}
