import { NextResponse } from "next/server";
import { createSessionToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { username, email, uid } = await req.json();

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Allowed admin list
    const allowedAdminUsernames = [
      (process.env.GITHUB_ADMIN_USERNAME || "").toLowerCase(),
      "stewy8506",
      "anuvabdas"
    ].filter(Boolean);

    const isAllowed = allowedAdminUsernames.includes(username.toLowerCase());

    if (isAllowed) {
      const token = await createSessionToken();
      const response = NextResponse.json({ success: true, user: { username, email } });
      
      response.cookies.set("admin_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });
      
      return response;
    }

    return NextResponse.json(
      { error: `User '${username}' is not authorized to access the Admin Panel.` }, 
      { status: 403 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
