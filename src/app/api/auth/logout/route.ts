import { NextRequest, NextResponse } from "next/server";
import { verifyStaffToken, revokeSession } from "@/lib/serverAuth";

export async function POST(req: NextRequest) {
  const staffToken = req.cookies.get("ish_staff_token")?.value;
  if (staffToken) {
    const payload = verifyStaffToken(staffToken);
    if (payload?.sessionId) {
      revokeSession(payload.sessionId);
    }
  }

  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully.",
  });

  response.cookies.delete("ish_auth_role");
  response.cookies.delete("ish_auth_user");
  response.cookies.delete("ish_staff_token");

  return response;
}

