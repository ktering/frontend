import {NextResponse} from 'next/server';
import {clerkClient} from "@clerk/nextjs";

export async function POST(request: Request) {
    const requestBody = await request.json();
    const {userId} = requestBody;

    const user = await clerkClient.users.deleteUser(userId);

    return NextResponse.json({success: true});
}
