"use client";

import Link from "next/link";
import NavBtnLogout from "./NavBtnLogout";
import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function NavLoginLeftMenu() {
  const router = useRouter();
  const dropdownRef = useRef(null);
  const [dropDown, setDropDown] = useState(false);

  const onClickDropDown = () => {
    setDropDown(!dropDown);
  };

  //
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropDown(false);
      }
    };
    //
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropDown]);
  //

  return (
    <div className="h-full w-1/3 flex justify-center items-center relative">
      <div ref={dropdownRef}>
        <button
          onClick={(e) => onClickDropDown(e)}
          className="underline-offset-8 underline p-3 hover:text-gray-400"
        >
          M E N U
        </button>
      </div>

      {dropDown && (
        <ul className="w-full absolute z-auto bg-gray-300 p-4 rounded-lg dropdown-left top-[100%]">
          <li className="dropDownLi h-14 flex justify-center items-center w-full">
            <Link
              className="underline-offset-8 underline p-3 hover:text-gray-400"
              href={"/membership/schedule"}
            >
              H O M E
            </Link>
          </li>
          <li className="dropDownLi h-14 flex justify-center items-center w-full">
            <Link
              className="underline-offset-8 underline p-3 hover:text-gray-400"
              href={"/membership/settings"}
            >
              S E T T I N G S
            </Link>
          </li>
          <NavBtnLogout />
        </ul>
      )}
    </div>
  );
}
