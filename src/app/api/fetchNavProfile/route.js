import { customInitApp } from '@/lib/firebase-admin-config';
import { auth } from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { NextResponse } from 'next/server';

export async function POST(req) {

    await customInitApp();

    try {
        const idToken = await req.json();
        const decodedToken = await auth().verifyIdToken(idToken);

        const uid = decodedToken.uid;
        const docListWord = uid.slice(0, 2);
        const firebase = getFirestore();

        const profileSnap = await firebase.collection('users').doc(`userList_${docListWord}`).get();
        const profileData = profileSnap.data();
        let profileImgUrl = "";
        let userStatus = "";
        let displayName = "";


        if (!profileData || !profileData[uid]) {
            return NextResponse.json({ data: { profileImgUrl, userStatus, displayName }, messagge: 'not found data' }, { status: 200 });
        }

        profileImgUrl = profileData[uid].profileImgURL;
        userStatus = profileData[uid].userStatus;
        displayName = profileData[uid].displayName;
        return NextResponse.json({ data: { profileImgUrl, userStatus, displayName }, message: 'Successfully retrieved fetchNavProfile.' }, { status: 200 });
    }
    catch (err) {
        console.log("Err /api/fetchProfile", err);
        return NextResponse.json({ data: {}, message: "err /api/fetchNavProfile" }, { status: 500 });
    }
}