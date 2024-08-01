import { customInitApp } from '@/lib/firebase-admin-config';
import { auth } from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server'

//
export async function POST(req, res) {
    //
    await customInitApp();
    //
    const session = cookies().get("session")?.value;
    if (!session) return NextResponse.json({ err: "/api/fetcheditSchedule > session." }, { status: 401 });
    //
    try {
        const decodedClaims = await auth().verifySessionCookie(session, true);
        if (!decodedClaims) {
            return NextResponse.json({ isLogged: false }, { status: 401 });
        }
        //
        const firestore = getFirestore();
        const uid = decodedClaims.uid;
        const docListWord = uid.slice(0, 2);
        //
        async function setHoliday() {
            const kHolidayRef = firestore.collection("holiday").doc('republicOfKorea');
            const kHolidaySnap = await kHolidayRef.get();
            if (kHolidaySnap.exists) {
                return console.log("holiday data already exists.");
            }
            //
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
            //
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
            return
        }
        setHoliday();
        //

        async function initUserData() {
            //
            const newUserData = {
                [uid]: {
                    registrationTime: new Date().toISOString(),
                    displayName: "testName",
                    email: decodedClaims.email,
                    profileImgURL: "",
                    userStatus: "",
                    animationView: "",
                }
            };
            //
            const usersRef = firestore.collection(`users`).doc(`userList_${docListWord}`);
            const usersSnap = await usersRef.get();
            if (!usersSnap.exists) {
                await usersRef.set(newUserData);
                return;
            }
            else {
                const userData = usersSnap.data();
                const userDataUid = Object.keys(userData)[0];
                if (uid !== userDataUid) {
                    await usersRef.update(newUserData);
                    return;
                }
                else {
                    console.log("user data already exists.");
                    return;
                }
            }
        }
        initUserData();
        //
        async function initScheduleData() {
            //
            const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const newScheduleData = {
                midnight: { settime: '0', memo: `today midnight`, type: `routine`, status: "" },
                breakfast: { settime: '1000', memo: `today breakfast`, type: `routine`, status: "" },
                lunch: { settime: '2000', memo: `today lunch`, type: `routine`, status: "" },
                dinner: { settime: '3000', memo: `today dinner`, type: `routine`, status: "" },
            }
            //
            const sDocRef = firestore.collection('schedule').doc(`scheduleList_${docListWord}`);
            const uidColList = await sDocRef.listCollections();
            if (uidColList.includes(uid)) {
                console.log("user schedule data already exists.");
                return;
            }
            else {
                for (const day of weekDays) {
                    await sDocRef.collection(uid).doc(day).set(newScheduleData);
                }
            }
        }
        initScheduleData();
        //

        console.log('init data =========================');
    }
    catch (err) {
        console.log("Err : api/create init data", err);
    }
    return NextResponse.json({}, { status: 200 });
}