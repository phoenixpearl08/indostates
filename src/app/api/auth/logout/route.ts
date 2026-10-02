import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  response.cookies.delete("ish_auth_role");
  response.cookies.delete("ish_auth_user");

  return response;
}
