import {NextResponse} from 'next/server';
import {clerkClient} from "@clerk/nextjs";

export async function POST(request: Request) {
    const requestBody = await request.json();
    const {ktererSignUpCompleted, userId} = requestBody;

    await clerkClient.users.updateUserMetadata(userId, {
        publicMetadata: {
            ktererSignUpCompleted
        }
    })

    const user = await clerkClient.users.getUser(userId);

    return NextResponse.json({success: true, user});
}
