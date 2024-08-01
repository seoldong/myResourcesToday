import { ScheduleProvider } from "@/context/scheduleContext";
import { checkLoginStatus } from "@/logic-s/loginStat";
import { getFirestore } from "firebase-admin/firestore";
import Link from "next/link";
//
export default async function MembershipScheduleLayout({ children }) {
  //
  const logStatus = await checkLoginStatus();

  let scheduleListArr = [];

  if (logStatus.isLogged === true) {
    const uid = logStatus.userCred.uid;
    const scheduleData = await getScheduleData(uid);
    //
    if (scheduleData) {
      scheduleListArr = scheduleData;
    }
  }
  //
  function secondsToTimeString(seconds) {
    const hours = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  //
  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <div className="h-3/5 w-4/5 flex flex-col justify-center items-center">
        <ScheduleProvider initData={scheduleListArr}>
          {children}
        </ScheduleProvider>
      </div>

      <div className="h-2/5 w-4/5 flex flex-col items-center p-5">
        <ol className="h-full w-full overflow-auto">
          {scheduleListArr.map((schedule, idx) => {
            const scheduleName = Object.keys(schedule)[0];
            const secheduleSettime = secondsToTimeString(
              schedule[scheduleName].settime
            );

            return (
              <li
                className="timeList h-[3rem] w-full mb-3 hover:bg-gray-200 px-10 bg-gray-300"
                key={`${schedule}${idx}`}
              >
                <Link
                  className="h-full w-full flex justify-between items-center"
                  href={`/membership/${scheduleName}`}
                >
                  <span>{scheduleName}</span>
                  <span>{secheduleSettime}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

//-------------------------------------------------

async function getScheduleData(uid) {
  const docListWord = uid.slice(0, 2);
  const firestore = getFirestore();
  //
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date().getDay();
  const dayOfWeek = daysOfWeek[today];

  //   try {
  const scheduleListDocRef = firestore
    .collection("schedule")
    .doc(`scheduleList_${docListWord}`);
  const todayScheduleListDocRef = scheduleListDocRef
    .collection(uid)
    .doc(dayOfWeek);
  const scheduleData = await todayScheduleListDocRef.get();
  const scheduleListObj = scheduleData.data();
  //
  let todayScheduleListArr = [];
  for (let key in scheduleListObj) {
    todayScheduleListArr.push({ [key]: scheduleListObj[key] });
  }
  //
  const now = new Date();
  const secondsNow =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  const sortedScheduleArr = todayScheduleListArr.sort((a, b) => {
    let aData = a[Object.keys(a)[0]]["settime"] - secondsNow;
    let bData = b[Object.keys(b)[0]]["settime"] - secondsNow;
    if (aData <= 0) aData = aData + 86400;
    if (bData <= 0) bData = bData + 86400;
    return aData - bData;
  });
  return sortedScheduleArr;
}
