"use client";

import updateNavUserStatus from "@/serverActions/updateNavUserStatus";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function NavUserState({ userStatus }) {
  const router = useRouter();
  const dropdownRef = useRef(null);
  const [emojiList, setEmojiList] = useState(false);
  //
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setEmojiList(false);
      }
    };
    //
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  //
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const response = await updateNavUserStatus(formData);
    setEmojiList(false);

    if (response.success) {
      router.refresh();
    }
  };
  //
  return (
    <div ref={dropdownRef} className="">
      <button
        className="underline underline-offset-8 hover:text-gray-400"
        onClick={() => setEmojiList(!emojiList)}
      >
        {userStatus ? userStatus : "state ❓"}
      </button>
      {emojiList && (
        <form
          className="userStateForm left-0 top-0 h-[4rem] flex justify-center items-center absolute shadow-md mt-4 p-4 rounded-lg w-full dropdown-right bg-gray-300"
          onSubmit={handleSubmit}
        >
          <select name="userStatus" id="emoji">
            <option value={`desk 🙂`}>desk 🙂</option>
            <option value={`eating 😋`}>eating 😋</option>
            <option value={`meeting 😐`}>meeting 😐</option>
            <option value={`restroom 🤫`}>restroom 🤫</option>
            <option value={`chatting 😁`}>chatting 😁</option>
            <option value={`notWorking 🙄`}>notWorking 🙄</option>
          </select>
          <button
            className="userStateBtn ml-5 underline underline-offset-8 hover:text-gray-400"
            type="submit"
          >
            <span className='userStateBtnText'>submit</span>
          </button>
        </form>
      )}
    </div>
  );
}
