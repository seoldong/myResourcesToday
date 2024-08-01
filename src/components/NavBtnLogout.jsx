"use client";

import { auth } from "@/lib/firebase-config";
import { invalidateSession } from "@/logic-c/apiRoute";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function NavBtnLogout() {
  const router = useRouter();
  //
  const onClickLogOut = async (e) => {
    e.preventDefault();
    try {
      const logOut = await signOut(auth);
      await invalidateSession();
      await document.documentElement.setAttribute("data-theme", "light");
      router.refresh();
      router.push("/");
      //
    } catch (error) {
      console.log("log out err : ", error);
    }
  };

  return (
    <li
      className="dropDownLi h-14 flex justify-center items-center w-full"
      onClick={(e) => onClickLogOut(e)}
    >
      <span className='underline-offset-8 underline p-3 hover:text-gray-400' >L O G O U T</span>
    </li>
  );
}
