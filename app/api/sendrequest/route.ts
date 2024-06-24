import { NextRequest, NextResponse } from "next/server";
import { friendRequests, users } from "@/db";

export async function sendFriendRequest(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const { firebaseId, receiverUsername } = requestBody;

    const sender = await users.findUnique({
      where: {
        firebaseId,
      },
    });

    if (!sender) {
      return NextResponse.json(
        { Message: "Sender User does not exist" },
        { status: 404 }
      );
    }

    const receiver = await users.findUnique({
      where: {
        username: receiverUsername,
      },
    });

    if (!receiver) {
      return NextResponse.json(
        { Message: "Receiver User does not exist" },
        { status: 404 }
      );
    }

    await friendRequests.create({
      data: {
        senderId: sender.id,
        receiverId: receiver.id,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { Message: "Friend Request Sent" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { Message: "Could not send friend request" },
      { status: 500 }
    );
  }
}
