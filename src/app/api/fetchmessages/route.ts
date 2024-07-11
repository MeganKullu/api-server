import { NextResponse, NextRequest } from "next/server";
import { messages } from "@/src/db/db";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        const requestBody = await req.json();
        const { senderId, receiverId } = requestBody;

        const message = await messages.findMany({
            where: {
                OR: [
                    {
                        senderId: senderId,
                        receiverId: receiverId
                    },
                    {
                        senderId: receiverId,
                        receiverId: senderId
                    }
                ]
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        return NextResponse.json(
            { Message: "Messages fetched successfully", messages: message },
            { status: 200 }
        );

    } catch (error) {
        return NextResponse.json(
            { Message: "Could not fetch messages at this time" },
            { status: 500 }
        );
        
    }
}