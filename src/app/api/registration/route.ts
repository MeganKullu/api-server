import { NextResponse, NextRequest } from "next/server";
import { users } from "@/src/db/db";

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const { language, firebaseId, username, status, avatar } = requestBody;

    const user = await users.findUnique({
      where: {
        username,
      },
    });

    if (user) {
      return NextResponse.json(
        { Message: "Username already exists" },
        { status: 400 }
      );
    }

    const newUser = await users.create({
      data: {
        language,
        firebaseId,
        username,
        status,
        avatar
      },
    });

    return NextResponse.json(
      { Message: "User registered successfully", user: newUser},
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { Message: "Could not update at this time" },
      { status: 500 }
    );
  }
}
