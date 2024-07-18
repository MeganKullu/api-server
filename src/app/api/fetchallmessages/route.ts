import { NextResponse, NextRequest } from "next/server";
import { messages, users } from "@/src/db/db";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const requestBody = await req.json();
        const { firebaseId } = requestBody;   

        const allFriendsWithMessages = await users.findUnique({
            where : {
                firebaseId: firebaseId,
            },
            include: {
                friends: {
                    include :{
                       receivedMessages: true,
                       messagesSent: true,                      
                    }
                }
            }
        })

        return NextResponse.json(
            { Message: "Messages fetched successfully", friendsWithMessages: allFriendsWithMessages },
            { status: 200 }
        ); 
        
    } catch (error) {
        return NextResponse.json(
            { Message: "Could not fetch messages at this time" },
            { status: 500 }
        );
      
    }
}