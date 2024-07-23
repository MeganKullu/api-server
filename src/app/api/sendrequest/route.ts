import { NextRequest, NextResponse } from "next/server";
import { friendRequests, users } from "@/src/db/db";

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const { firebaseId, receiverUsername } = requestBody;

    // Find the sender user by firebaseId
    const sender = await users.findUnique({
      where: { firebaseId },
    });

    if (!sender) {
      return NextResponse.json(
        { Message: "Sender User does not exist" },
        { status: 404 }
      );
    }

    // Find the receiver user by username
    const receiver = await users.findUnique({
      where: { username: receiverUsername },
    });

    if (!receiver) {
      return NextResponse.json(
        { Message: "Receiver User does not exist" },
        { status: 404 }
      );
    }

    // Check if a friend request already exists between the users
    const existingRequest = await friendRequests.findFirst({
      where: {
        senderId: sender.firebaseId,
        receiverId: receiver.firebaseId,
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { Message: "Friend request already sent" },
        { status: 400 }
      );
    }

    // Create a new friend request
    await friendRequests.create({
      data: {
        senderId: sender.firebaseId,
        receiverId: receiver.firebaseId,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { Message: "Friend Request Sent"},
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { Message: "Could not send friend request"},
      { status: 500 }
    );
  }
}
