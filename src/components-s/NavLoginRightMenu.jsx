import NavMode from '@/components/NavMode';
import NavUserState from "@/components/NavUserState";
import { checkLoginStatus } from "@/logic-s/loginStat";
import { getFirestore } from "firebase-admin/firestore";
import Image from "next/image";
//
export default async function NavLoginRightMenu() {
  //
  const logStatus = await checkLoginStatus();
  let navUserData = {};

  if (logStatus.isLogged) {
    navUserData = await getNavUserData(logStatus.userCred.uid);
  }

  //
  return (
    <ul className="h-full flex items-center relative w-2/3 justify-end pr-5">
      <div className=" text-center text-sm overflow-auto mx-3">
        {navUserData.displayName}
      </div>
      <div className="text-center mx-3 text-sm">
        <NavUserState userStatus={navUserData.userStatus} />
      </div>
      <div className="text-center mx-3 text-sm">
        <NavMode aniView={navUserData.animationView} />
      </div>
      <div className="profileImg h-[2.5rem] w-[2.5rem] flex justify-center items-center mx-3">
        <Image
          className="h-full w-full rounded-full"
          src={
            navUserData.profileImgURL
              ? navUserData.profileImgURL
              : "/nouser.jpg"
          }
          width={"50"}
          height={"50"}
          alt="profile img"
        />
      </div>
    </ul>
  );
}

//-------------------------------------------------

async function getNavUserData(uid) {
  const defaultUserData = {
    displayName: "",
    profileImgURL: "",
    userStatus: "",
    animationView: "",
  };

  const docListWord = uid.slice(0, 2);
  const firebase = getFirestore();

  try {
    const profileSnap = await firebase
      .collection("users")
      .doc(`userList_${docListWord}`)
      .get();

    if (profileSnap.exists) {
      const navProfileData = profileSnap.data();
      // console.log(navProfileData[uid]);

      return {
        displayName:
          navProfileData[uid].displayName || defaultUserData.displayName,
        profileImgURL:
          navProfileData[uid].profileImgURL || defaultUserData.profileImgURL,
        userStatus:
          navProfileData[uid].userStatus || defaultUserData.userStatus,
        animationView:
          navProfileData[uid].animationView || defaultUserData.animationView,
      };
    } else {
      console.log(`User profile not found for uid: ${uid}`);
      return defaultUserData;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    return defaultUserData;
  }
}
