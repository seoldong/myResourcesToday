import { customInitApp } from '@/lib/firebase-admin-config';
import { auth } from 'firebase-admin';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';


export async function POST(req) {
    customInitApp();

    const session = cookies().get("session")?.value;
    if (!session) {
        return NextResponse.json({ err: "No session found." }, { status: 401 });
    }

    try {
        const decodedClaims = await auth().verifySessionCookie(session, true);
        if (!decodedClaims) {
            return NextResponse.json({ err: "Invalid session." }, { status: 401 });
        }

        const uid = decodedClaims.uid;
        const docListWord = uid.slice(0, 2);
        const firestore = getFirestore();
        const scheduleData = await req.json();

        const { scheduleName, newData } = scheduleData;

        const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const today = new Date().getDay();
        //작업하다가 발견한건데 수정할 데이터 요일도 받아와서 요일에 맞는 스케줄 변경을 해야함.
        const dayOfWeek = weekDays[today];
        const scheduleDocRef = firestore.collection('schedule')
            .doc(`scheduleList_${docListWord}`)
            .collection(uid)
            .doc(dayOfWeek);

        const currentDataToDelete = {
            [scheduleName]: FieldValue.delete()
        };

        await scheduleDocRef.update(currentDataToDelete);
        await scheduleDocRef.update(newData);

        return NextResponse.json({}, { status: 200 });
    } catch (err) {
        console.error("Error in /api/fetcheditSchedule:", err);
        return NextResponse.json({ err: "Internal server error." }, { status: 500 });
    }
}
