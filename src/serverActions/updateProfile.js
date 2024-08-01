'use server'

import { checkLoginStatus } from '@/logic-s/loginStat';
import { getFirestore } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
const { getStorage } = require('firebase-admin/storage');
import { customInitApp } from '@/lib/firebase-admin-config';
import { redirect } from 'next/navigation';


export default async function updateProfile(formData) {
    customInitApp();

    try {
        const animationView = await formData.get('animationView')
        const displayName = await formData.get('displayName')
        const profileImgFile = await formData.get('profileImg')
        //
        const logStatus = await checkLoginStatus();
        const uid = logStatus.userCred.uid;
        const docListWord = uid.slice(0, 2);
        const storage = getStorage().bucket();
        const firebase = getFirestore();

        //
        const imgPath = `/users/userImgList_${docListWord}/${uid}/${profileImgFile.name}`;
        const imgDirPath = `/users/userImgList_${docListWord}/${uid}/`;
        const imgRef = storage.file(imgPath);
        //
        if (profileImgFile.size !== 0 && imgRef.exists) {
            const [files] = await storage.getFiles(imgDirPath);
            await Promise.all(files.map(file => file.delete()));
        }
        //
        let imgUrl;
        if (profileImgFile.size !== 0) {
            await imgRef.save(profileImgFile.stream(), {
                metadata: {
                    contentType: profileImgFile.type,
                }
            });
            const option = {
                action: 'read',
                expires: '03-01-2500',
            };
            [imgUrl] = await imgRef.getSignedUrl(option);
        }
        //
        const profileRef = firebase.collection('users').doc(`userList_${docListWord}`);
        const doc = await profileRef.get();
        const existingData = doc.exists ? doc.data() : {};
        // 
        const newData = {
            [uid]: {
                ...existingData[uid],
                displayName: displayName || existingData[uid].displayName,
                animationView: animationView || null, 
                profileImgURL: imgUrl || existingData[uid].profileImgURL,
            }
        };

        const profileUpdate = await profileRef.set(newData, { merge: true });
        // revalidatePath("/membership/schedule");

        // return { success: true };
    } catch (err) {
        console.error("Error in < checkLoginStatus >", err);
        return { success: false };
    }
    revalidatePath('/membership/schedule')
    redirect('/membership/schedule')
}
