import { auth } from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
    const session = cookies().get('session')?.value;

    try {
        const decodedToken = await auth().verifySessionCookie(session);
        const uid = decodedToken.uid;
        const docListWord = uid.slice(0, 2);
        const firebase = getFirestore();
        const profileRef = firebase.collection('users').doc(`userList_${docListWord}`);


        const doc = await profileRef.get();
        const existingData = doc.exists ? doc.data() : {};


        const newUserStatus = await req.json();
        const newData = {
            [uid]: {
                ...existingData[uid],
                userStatus: newUserStatus
            }
        };

        await profileRef.set(newData, { merge: true });

        return NextResponse.json({ data: {}, message: 'Successfully updated user status.' }, { status: 200 });
    } catch (err) {
        console.error("Error in /api/updateUserStatus", err);
        return NextResponse.json({ data: {}, message: "Error updating user status." }, { status: 500 });
    }
}
