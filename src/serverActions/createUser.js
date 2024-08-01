'use server'

import { customInitApp } from '@/lib/firebase-admin-config';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { redirect } from 'next/navigation';

export default async function createUser(formData) {
    await customInitApp();

    const email = formData.get('email');
    const password = formData.get('password');
    const reconfirm = formData.get('reconfirm');

    if (password !== reconfirm) {
        return { message: 'The password does not match.' };
    }

    try {
        const auth = getAuth();
        const userRecord = await auth.createUser({
            email: email,
            emailVerified: false,
            password: password,
        });
        console.log('Successfully created new user');

        const uid = userRecord.uid;
        const docListWord = uid.slice(0, 2);
        const firestore = getFirestore();

        // 사용자 초기 데이터 설정
        await setHolidayData(firestore);
        await initUserData(firestore, uid, email, docListWord);
        await initScheduleData(firestore, uid, docListWord);

    } catch (error) {
        console.log('Error creating new user:', error);
        return { message: 'Error creating new user.', error };
    }
    redirect("/login");
}

async function setHolidayData(firestore) {
    try {
        const kHolidayRef = firestore.collection("holiday").doc('republicOfKorea');
        const kHolidaySnap = await kHolidayRef.get();
        if (kHolidaySnap.exists) {
            console.log("holiday data already exists.");
            return;
        }

        const serviceUrl = `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService`;
        const operation = "getRestDeInfo";
        const apiKey = process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY_DECODING;
        const year = 2024;
        const type = "json";
        const ResultNum = 100;

        const originalHolidayData = await fetch(
            `${serviceUrl}/${operation}?solYear=${year}&_type=${type}&numOfRows=${ResultNum}&ServiceKey=${apiKey}`
        );

        const holidayJson = await originalHolidayData.json();
        const holidayDataArr = holidayJson.response.body.items.item;

        let kHolidayObj = {};
        holidayDataArr.forEach((data) => {
            kHolidayObj[data.locdate] = {
                dateName: data.dateName,
                locdate: data.locdate,
                isHoliday: data.isHoliday,
            };
        });
        await kHolidayRef.set(kHolidayObj);
        console.log("Save Korea's holiday data to the database.");
    } catch (error) {
        console.log('Error setting holiday data:', error);
    }
}

async function initUserData(firestore, uid, email, docListWord) {
    try {
        const newUserData = {
            [uid]: {
                registrationTime: new Date().toISOString(),
                displayName: "testName",
                email: email,
                profileImgURL: "",
                userStatus: "",
                animationView: "",
            }
        };

        const usersRef = firestore.collection(`users`).doc(`userList_${docListWord}`);
        const usersSnap = await usersRef.get();
        if (!usersSnap.exists) {
            await usersRef.set(newUserData);
        } else {
            const userData = usersSnap.data();
            const userDataUid = Object.keys(userData)[0];
            if (uid !== userDataUid) {
                await usersRef.update(newUserData);
            } else {
                console.log("user data already exists.");
            }
        }
    } catch (error) {
        console.log('Error initializing user data:', error);
    }
}

async function initScheduleData(firestore, uid, docListWord) {
    try {
        const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const newScheduleData = {
            midnight: { settime: '0', memo: `today midnight`, type: `routine`, status: "" },
            breakfast: { settime: '1000', memo: `today breakfast`, type: `routine`, status: "" },
            lunch: { settime: '2000', memo: `today lunch`, type: `routine`, status: "" },
            dinner: { settime: '3000', memo: `today dinner`, type: `routine`, status: "" },
        }

        const sDocRef = firestore.collection('schedule').doc(`scheduleList_${docListWord}`);
        const uidColList = await sDocRef.listCollections();
        const uidCollectionNames = uidColList.map(col => col.id); // Collection names list

        if (uidCollectionNames.includes(uid)) {
            console.log("user schedule data already exists.");
            return;
        } else {
            for (const day of weekDays) {
                await sDocRef.collection(uid).doc(day).set(newScheduleData);
            }
        }
    } catch (error) {
        console.log('Error initializing schedule data:', error);
    }
}
