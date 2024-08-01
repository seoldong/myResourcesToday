import { customInitApp } from '@/lib/firebase-admin-config';
import { auth } from 'firebase-admin';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'

//
export async function POST(req, res) {
    //
    await customInitApp();
    //
    const session = cookies().get("session")?.value;
    if (!session) return NextResponse.json({ err: "/api/fetchDeleteSchedule > session." }, { status: 401 });
    //
    try {
        const decodedClaims = await auth().verifySessionCookie(session, true);
        if (!decodedClaims) return NextResponse.json({ err: "/api/fetchDeleteSchedule > session." }, { status: 401 });
        const uid = decodedClaims.uid;
        const docListWord = uid.slice(0, 2);
        const firestore = getFirestore();
        const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const today = new Date().getDay();
        const dayOfWeek = weekDays[today];
        //
        const scheduleName = await req.json();
        console.log('scheduleName',scheduleName);
        //
        const scheduleDocRef = firestore.collection('schedule')
            .doc(`scheduleList_${docListWord}`)
            .collection(uid)
            .doc(dayOfWeek);
        //
        const targetSchedule = {
            [scheduleName]: FieldValue.delete()
        };
        await scheduleDocRef.update(targetSchedule);
        return NextResponse.json({ message: `success delete : ${scheduleName}` }, { status: 200 })
    }
    catch (err) {
        return NextResponse.json({ message: `Err /api/fetchDeleteSchedule` }, { status: 200 })
    }
}