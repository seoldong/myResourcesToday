import CancelBtn from "@/components/CancelBtn";
import ProfileImgInput from "@/components/ProfileImgInput";
import { checkLoginStatus } from "@/logic-s/loginStat";
import updateProfile from "@/serverActions/updateProfile";
import { getFirestore } from "firebase-admin/firestore";

export default async function SettingsPage() {

  const logStatus = await checkLoginStatus();
  //
  let profileData = {
    displayName: "",
    animationView: "",
    profileImgURL: "",
  };

  if (logStatus.isLogged) {
    profileData = await getProfileData(logStatus.userCred.uid);
  }

  return (
    <form className="h-4/5 w-4/5" action={updateProfile}>
      <ul className="h-4/5 w-full flex flex-col items-center">
        <ProfileImgInput />
        <div className="w-full flex flex-col justify-center items-center mt-[5rem]">
          <label className="inputList px-2 mb-4" htmlFor="displayName">
            D I S P L A Y _ N A M E
          </label>
          <input
            className="w-3/5 text-center"
            name="displayName"
            type="text"
            id="displayName"
            placeholder={profileData.displayName}
          />
        </div>
        <div className="flex flex-col justify-center items-center mt-[5rem]">
          <label className="mb-4 px-2" htmlFor="aniView">
            A N I M A T I O N _ V I E W
          </label>
          <input
            className="text-center h-[2rem] w-[2rem]"
            name="animationView"
            type="checkbox"
            id="aniView"
            defaultChecked={profileData.animationView === "on"}
          />
        </div>
      </ul>
      <div className="h-1/5 flex justify-around items-center">
        <div>
          <button className="scheduleControlBtn underline underline-offset-8 hover:bg-slate-300 p-3">
            S A V E
          </button>
        </div>
        <div>
          <CancelBtn />
        </div>
      </div>
    </form>
  );
}

//

async function getProfileData(uid) {
  const defaultUserData = {
    displayName: "",
    animationView: "",
    profileImgURL: "",
  };

  const docListWord = uid.slice(0, 2);
  const firebase = getFirestore();

  try {
    const profileSnap = await firebase
      .collection("users")
      .doc(`userList_${docListWord}`)
      .get();

    if (profileSnap.exists) {
      const profileData = profileSnap.data();

      return {
        displayName:
          profileData[uid].displayName || defaultUserData.displayName,
        animationView:
          profileData[uid].animationView || defaultUserData.animationView,
        profileImgURL:
          profileData[uid].profileImgURL || defaultUserData.profileImgURL,
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
