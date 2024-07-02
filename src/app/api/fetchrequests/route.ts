import { NextRequest, NextResponse } from "next/server";
import { friendRequests, users } from "@/src/db/db";

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const { firebaseId } = requestBody;

    const user = await users.findUnique({
      where: { firebaseId },
    });

    if (!user) {
      return NextResponse.json(
        { Message: "Sender User does not exist" },
        { status: 404 }
      );
    }

    const pendingRequests = await friendRequests.findMany({
      where: {
        receiverId: user.id,
        status: "PENDING",
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    if (pendingRequests) {
      return NextResponse.json(
        { Message: "Pending requests found", pendingRequests },
        { status: 200 }
      );
    }

    if (!pendingRequests) {
      return NextResponse.json(
        { Message: "No pending requests" },
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
