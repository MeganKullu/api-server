import { NextResponse, NextRequest } from "next/server";
import { messages, users } from "@/src/db/db";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const requestBody = await req.json();
    const { firebaseId } = requestBody;

    const userWithFriends = await users.findUnique({
      where: {
        firebaseId: firebaseId,
      },
      include: {
        friends: true,
      },
    });

    //Initialize an array to hold the results

    let friendsWithLastMessage = [];

    if (userWithFriends && userWithFriends.friends) {
      //Iterate over each friend to fetch the last message exchanged
      for (const friend of userWithFriends.friends) {
        // fetch the last message where the current user is either the sender or receiver

        const lastMessage = await messages.findFirst({
          where: {
            OR: [
              {
                senderId: userWithFriends.firebaseId,
                receiverId: friend.firebaseId,
              },
              {
                senderId: friend.firebaseId,
                receiverId: userWithFriends.firebaseId,
              },
            ],    
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        // Add the friend and the last message to the results array
        friendsWithLastMessage.push({
          friend: friend,
          lastMessage: lastMessage
            ? {
                content: lastMessage.content,
                createdAt: lastMessage.createdAt,
                isSender: lastMessage.senderId === userWithFriends.firebaseId,
              }
            : null,
        });
      }
    }

    return NextResponse.json(
      { Message: "Messages fetched successfully", friendsWithLastMessage },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { Message: "Could not fetch messages at this time" },
      { status: 500 }
    );
  }
}
