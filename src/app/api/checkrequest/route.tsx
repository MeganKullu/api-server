import { NextRequest, NextResponse } from "next/server";
import { friendRequests, users } from "@/src/db/db";

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const { firebaseId, receiverUsername } = requestBody;

    const sender = await users.findUnique({
      where: { firebaseId },
    });

    if (!sender) {
      return NextResponse.json(
        { Message: "Sender User does not exist" },
        { status: 404 }
      );
    }

    const receiver = await users.findUnique({
      where: { username: receiverUsername },
    });

    if (!receiver) {
      return NextResponse.json(
        { Message: "Receiver User does not exist" },
        { status: 404 }
      );
    }

    const existingRequest = await friendRequests.findFirst({
      where: {
        senderId: sender.firebaseId,
        receiverId: receiver.firebaseId,
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        {
          Message: "Friend request already sent",
          friendRequest: existingRequest.status,
        },
        { status: 201 }
      );
    } else {
      return NextResponse.json(
        { Message: "Friend request not sent" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { Message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
