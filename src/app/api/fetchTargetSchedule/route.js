import { auth } from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {


    const session = cookies().get("session")?.value;
    if (!session) {
        return NextResponse.json({ err: "No session found." }, { status: 401 });
    }

    try {
        const decodedClaims = await auth().verifySessionCookie(session, true);
        const uid = decodedClaims.uid;
        const docListWord = uid.slice(0, 2);
        const firestore = getFirestore();
        //
        const targetSchedule = await req.json();
        //
        const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const today = new Date().getDay();
        const dayOfWeek = weekDays[today];
        const scheduleDocRef = firestore.collection('schedule')
            .doc(`scheduleList_${docListWord}`)
            .collection(uid)
            .doc(dayOfWeek);
        const scheduleData = await scheduleDocRef.get();
        const scheduleListObj = scheduleData.data()
        const selectSchedule = scheduleListObj[targetSchedule.scheduleName]

        return NextResponse.json(selectSchedule, { status: 200 });
    } catch (err) {
        return NextResponse.json("/api/fetchTargetSchedule err", { status: 400 });
    }

}