import { NextRequest, NextResponse } from "next/server";
import { verifyUserCredentials } from "@/lib/serverAuth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const { user, error } = await verifyUserCredentials(email, password);

    if (!user || error) {
      return NextResponse.json(
        { error: error || "Authentication failed. Please verify your credentials." },
        { status: 401 }
      );
    }

    // Role-based target redirect determined strictly on the server
    let redirectUrl = "/portal/patient";
    if (user.role === "doctor") {
      redirectUrl = "/doctor/dashboard";
    } else if (user.role === "admin") {
      redirectUrl = "/admin/dashboard";
    }

    const response = NextResponse.json({
      success: true,
      user,
      redirectUrl,
      message: `Authenticated successfully as ${user.role.toUpperCase()}.`,
    });

    // Set secure auth cookie
    response.cookies.set("ish_auth_role", user.role, {
      httpOnly: false, // accessible to client store for routing
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days persistent session
      path: "/",
    });

    response.cookies.set("ish_auth_user", JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("API /api/auth/login error:", error);
    return NextResponse.json(
      { error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}
