import { NextResponse, NextRequest } from "next/server";
import { users } from "@/src/db/db";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { username } = await req.json();

    const userslist = await users.findMany({
      where: {
        username: {
          contains: username,
          mode: "insensitive",
        },
      },
    });

    if (userslist.length > 0) {
      return NextResponse.json(
        { Message: "User found", users: userslist },
        { status: 200 },
      );
    } else {
      return NextResponse.json({ Message: "User not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { Message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
