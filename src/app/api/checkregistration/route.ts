import { NextResponse, NextRequest } from "next/server";
import { users } from "@/src/db/db";


export async function POST(req: NextRequest, res: NextResponse) {

  try {
    const requestBody = await req.json();
    const { firebaseId } = requestBody;

    const user = await users.findUnique({
      where: {
        firebaseId,
      },
    });

    if (user) {
      return NextResponse.json(
        { Message: "User has registered", username: user.username},
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { Message: "User has not registered" },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { Message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
