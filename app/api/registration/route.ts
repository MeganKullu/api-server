import { NextResponse , NextRequest } from 'next/server';
import { users } from '@/db';

export async function POST(req: NextRequest) {
    try {
        const requestBody = await req.json();
        const { language, firebaseId, username } = requestBody;

        const user = await users.findUnique({
            where: {
                username
            },
        });

        if (user) {
            return NextResponse.json({ Message : 'Username already exists' }, { status : 400 });
        }

        await users.create({
            data: {
                language,
                firebaseId,
                username
            }
        });

    } catch (error) {
        return NextResponse.json({ Message : 'Could not update at this time' }, { status : 500 }); 
    }

}