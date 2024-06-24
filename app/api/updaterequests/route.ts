import { NextResponse, NextRequest } from "next/server";
import { friendRequests, users } from "@/db";

export async function updateFriendRequest (req:NextRequest) {
    try {
        const requestBody = await req.json();
        const { firebaseId, receiverUsername, status } = requestBody;

        const sender = await users.findUnique({
            where: {
                firebaseId
            }
        });

        if (!sender) {
            return NextResponse.json({ Message : 'Sender User does not exist' }, { status : 404 });
        }

        const receiver = await users.findUnique({
            where: {
                username : receiverUsername
            }
        });

        if (!receiver) {
            return NextResponse.json({ Message : 'Receiver User does not exist' }, { status : 404 });
        }

        const friendRequest = await friendRequests.findFirst({
            where: {
                senderId : sender.id,
                receiverId : receiver.id
            }
        });

        if (!friendRequest) {
            return NextResponse.json({ Message : 'Friend Request does not exist' }, { status : 404 });
        }

        await friendRequests.update({
            where: {
                id : friendRequest.id
            },
            data: {
                status
            }
        });

        return NextResponse.json({ Message : 'Friend Request Updated' }, { status : 200 });

    } catch (error) {
        return NextResponse.json({ Message : 'Could not update friend request' }, { status : 500 });
    }
}