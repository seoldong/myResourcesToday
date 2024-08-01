import { NextResponse } from 'next/server';
import { cookies, headers } from 'next/headers';
import { customInitApp } from '@/lib/firebase-admin-config';
import { auth } from 'firebase-admin';


export async function POST(req) {
    const requestPath = req.url;

    customInitApp();
    //
    try {
        const authorization = headers().get('Authorization');
        if (!authorization) return NextResponse.json({ isLogged: false, messaging: 'authorization err' }, { status: 200 })

        if (authorization.startsWith("Bearer ")) {
            const idToken = authorization.split("Bearer ")[1];
            const decodedToken = await auth().verifyIdToken(idToken);

            if (decodedToken) {
                const expiresIn = 24 * 60 * 60 * 1000; // 24시간
                const sessionCookie = await auth().createSessionCookie(idToken, { expiresIn });
                const options = {
                    name: "session",
                    value: sessionCookie,
                    maxAge: expiresIn,
                    httpOnly: true,
                    secure: true,
                };
                cookies().set(options);
                const test = cookies()?.get('session')
                return NextResponse.json({ isLogged: true, message: 'Session created', test }, { status: 200 });
            }
        }
    } catch (err) {
        console.error("Error in POST:", err);
        return NextResponse.json({ isLogged: false, error: 'Unauthorized', path: requestPath }, { status: 200 });
    }
}

export async function GET(req) {
    const requestPath = req.url

    const session = cookies().get("session")?.value || "";

    if (!session) {
        return NextResponse.json({ isLogged: false, message: "err session", path: requestPath }, { status: 401 });
    }

    const decodedClaims = await auth().verifySessionCookie(session, true);

    if (!decodedClaims) {
        return NextResponse.json({ isLogged: false, message: "err verifySession", path: requestPath }, { status: 401 });
    }

    return NextResponse.json({ isLogged: true, message: "success verify session", path: requestPath }, { status: 200 });
}
