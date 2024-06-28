import { NextResponse, NextRequest } from "next/server";
import { friendRequests, users } from "@/src/db/db";

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const { firebaseId, receiverUsername, status } = requestBody;

    // Validate status
    const validStatuses = ["PENDING", "ACCEPTED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { Message: "Invalid status provided" },
        { status: 400 }
      );
    }

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

    // Find the friend request
    const friendRequest = await friendRequests.findFirst({
      where: {
        senderId: sender.id,
        receiverId: receiver.id,
      },
    });

    if (!friendRequest) {
      return NextResponse.json(
        { Message: "Friend Request does not exist" },
        { status: 404 }
      );
    }

    // Update the friend request status
    await friendRequests.update({
      where: { id: friendRequest.id },
      data: { status },
    });

    return NextResponse.json(
      { Message: "Friend Request Updated" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { Message: "Could not update friend request" },
      { status: 500 }
    );
  }
}
