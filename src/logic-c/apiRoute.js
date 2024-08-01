'use client'

import { useRouter } from 'next/navigation';
//
export async function createSession(userData) {
    if (!userData) return;
    const url = `/api/createSession`;
    const idToken = await userData.getIdToken();
    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${idToken}`,
        },
    };

    const response = await fetch(url, options)
    if (response.status === 200) {
        // console.log("api create session : ", await response.json());
    }
}
//
export async function invalidateSession() {

    const url = `/api/invalidateSession`;
    const options = { method: "POST" };
    const response = await fetch(url, options);
    if (response.status === 200) {
        // console.log("api invalidate session", await response.json());
    }
}
//
export async function createInitData() {
    const url = `/api/createInitData`;
    const options = { method: "POST" };
    const response = await fetch(url, options);
    if (response.status === 200) {
        console.log("api create init data", await response.json());
    }
}
//
//
export async function fetchNavProfile(idToken) {
    const url = `/api/fetchNavProfile`;
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(idToken)
    };
    try {
        const response = await fetch(url, options);
        if (response.status === 200) {
            const resJson = await response.json();
            const message = resJson.message;
            const data = resJson.data;
            return data
        } else {
            console.error("Failed to fetch nav profile data", response.status);
        }
    } catch (error) {
        console.error("fetch nav profile Error:", error);
    }
}
//
export async function updateUserStatus(userStatus) {
    const url = `/api/updateUserStatus`;
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userStatus)
    };
    try {
        const response = await fetch(url, options);
        if (response.status === 200) {
            const resJson = await response.json();
            const message = resJson.message;
            const data = resJson.data;
            return data
        } else {
            console.error("Failed to fetch update user status", response.status);
        }
    } catch (error) {
        console.error("fetch update user status Error:", error);
    }
}
//
export async function deleteSchedule(scheduleName) {
    const url = `/api/deleteSchedule`;
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(scheduleName)
    };
    try {
        const response = await fetch(url, options);
        if (response.status === 200) {
            const resJson = await response.json();
            const message = resJson.message;
            const data = resJson.data;
            return data
        } else {
            console.error("Failed to /api/deleteSchedule : ", response.status);
        }
    } catch (error) {
        console.error("Failed to /api/deleteSchedule : ", error);
    }
}