import { customInitApp } from '@/lib/firebase-admin-config';
import { auth } from 'firebase-admin';
import { cookies } from 'next/headers';


export async function checkLoginStatus() {

  await customInitApp()

  const session = cookies().get("session")?.value;
  if (!session) {
    return { isLogged: false, userCred: "", message: "session err" }
  }

  try {
    const decodedToken = await auth().verifySessionCookie(session, true);
    return { isLogged: true, userCred: decodedToken, message: "success decodedToken" };

  } catch (error) {
    console.error("Session verification failed:", error);
    return { isLogged: false, userCred: "", message: "decodedToken err" };
  }
}