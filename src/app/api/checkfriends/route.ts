import { NextRequest, NextResponse } from "next/server";
import { friendRequests, users } from "@/src/db/db";

export async function POST(req: NextRequest) {
    try {
        const { firebaseId} = await req.json();

        const user = await users.findUnique({
            where: { firebaseId },
        });

        if (!user) {
            return NextResponse.json(
              { Message: "Sender User does not exist" },
              { status: 404 }
            );
        }

        // Fetch accepted friend requests where the user is the sender

        const friendsAsSender = await friendRequests.findMany({
            where: {
                senderId: user.id,
                status: "ACCEPTED",
            },
            include: {
                receiver: true,
            }
        });

        // Fetch accepted friend requests where the user is the receiver

        const friendsAsReceiver = await friendRequests.findMany({
            where: {
                receiverId: user.id,
                status: "ACCEPTED",
            },
            include: {
                sender: true,
            }
        });

        const friends = [...friendsAsSender, ...friendsAsReceiver];

        if (friends.length > 0) {
            return NextResponse.json(
                { Message: "Friends found", friends },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error("Failed to fetch friends:", error);
        return NextResponse.json(
          { Message: "Internal Server Error" },
          { status: 500 }
        );
    };
        
}