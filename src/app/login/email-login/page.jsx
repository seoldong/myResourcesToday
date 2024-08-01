"use client";

import { auth } from "@/lib/firebase-config";
import { createSession } from "@/logic-c/apiRoute";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

//
export default function LoginEmailLoginPage() {
  const router = useRouter();
  //
  const initEmail = {
    email: "",
    password: "",
    pwReconfirm: "",
  };
  const [eMailValue, setEmailValie] = useState(initEmail);
  //
  const onClickLogIn = async (e) => {
    e.preventDefault();
    try {
      if (eMailValue.password === eMailValue.pwReconfirm) {
        const signIn = await signInWithEmailAndPassword(
          auth,
          eMailValue.email,
          eMailValue.password
        );
        await createSession(signIn.user); //세션 만들어야 해서 클라이언트 페이지로 작성
        router.push("/membership/schedule");
        router.refresh();
      }
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        alert("The user does not exist.");
      } else if (err.code === "auth/wrong-password") {
        alert("Password error.");
      } else {
      }
      console.log("Err logIn-EmailPw / onClickLogIn : ", err);
    }
  };
  //
  return (
    <form className="h-4/5 w-4/5">
      <ul className="h-4/5 w-full flex flex-col items-center">
        <li className="flex flex-col justify-center items-center">
          <label className="mb-4" htmlFor="email">
            E - M A I L
          </label>
          <input
            className="text-center"
            id="email"
            type="email"
            value={eMailValue.email}
            onChange={(e) =>
              setEmailValie({ ...eMailValue, email: e.target.value })
            }
            autoComplete="on"
          />
        </li>

        <li className="flex flex-col justify-center items-center mt-[5rem]">
          <label className="mb-4" htmlFor="password">
            <span className="">P A S S W O R D</span>
          </label>
          <input
            className="text-center"
            id="password"
            type="password"
            value={eMailValue.password}
            onChange={(e) =>
              setEmailValie({ ...eMailValue, password: e.target.value })
            }
            autoComplete="off"
          />
        </li>
        <li className="flex flex-col justify-center items-center mt-[5rem]">
          <label className="mb-4" htmlFor="pwReconfirm">
            <span className="">P A S S W O R D _ R E C O N F I R M</span>
          </label>
          <input
            className="text-center"
            id="pwReconfirm"
            type="password"
            value={eMailValue.pwReconfirm}
            onChange={(e) =>
              setEmailValie({ ...eMailValue, pwReconfirm: e.target.value })
            }
            autoComplete="off"
          />
        </li>
      </ul>

      <ul className="h-1/5 flex justify-around items-center">
        <li className="flex flex-col">
          <button
            onClick={(e) => onClickLogIn(e)}
            className="underline underline-offset-8 p-3 hover:text-gray-400"
          >
            S I G N _ I N
          </button>
        </li>
        <li className="">
          <Link
            className="underline underline-offset-8 p-3 hover:text-gray-400"
            href={"/login/email-createAccount"}
          >
            <span>S I G N _ U P</span>
          </Link>
        </li>
        <li className="">
          <button
            className="underline underline-offset-8 p-3 hover:text-gray-400"
            onClick={(e) => router.back()}
          >
            <span>P R E V</span>
          </button>
        </li>
      </ul>
    </form>
  );
}
