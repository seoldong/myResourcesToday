'use server'

import { customInitApp } from '@/lib/firebase-admin-config';
import { checkLoginStatus } from '@/logic-s/loginStat';
import { getFirestore } from 'firebase-admin/firestore';
import { redirect } from 'next/navigation';

export default async function addSchedule(formData) {
    customInitApp();

    const title = formData.get('title')
    const time = formData.get('time')
    const memo = formData.get('memo')

    try {
        const logStatus = await checkLoginStatus();
        const uid = logStatus.userCred.uid;
        const docListWord = uid.slice(0, 2);
        const firebase = getFirestore();

        //
        const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const today = new Date().getDay();
        const dayOfWeek = weekDays[today];
        const newScheduleData = {
            [title]: { settime: time, memo: memo, type: `routine`, status: "" },
        }
        const scheduleRef = firebase.collection('schedule').doc(`scheduleList_${docListWord}`).collection(uid).doc(dayOfWeek);
        await scheduleRef.update(newScheduleData);

    } catch (err) {
        console.log('addSchedule err', err);
    }
    redirect('/membership/schedule')
}