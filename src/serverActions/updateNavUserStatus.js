'use server'
import { checkLoginStatus } from '@/logic-s/loginStat';
import { getFirestore } from 'firebase-admin/firestore';
//
export default async function updateNavUserStatus(formData) {

    try {
        const logStatus = await checkLoginStatus();
        const uid = logStatus.userCred.uid;
        const docListWord = uid.slice(0, 2);
        const firebase = getFirestore();
        const profileRef = firebase.collection('users').doc(`userList_${docListWord}`);

        const doc = await profileRef.get();
        const existingData = doc.exists ? doc.data() : {};

        const newData = {
            [uid]: {
                ...existingData[uid],
                userStatus: formData.get('userStatus')
            }
        };
        await profileRef.set(newData, { merge: true });
        return { success: true }
    } catch (err) {
        console.error("Error in < UpdateUserStatus >", err);
        return { success: false }
    }

};