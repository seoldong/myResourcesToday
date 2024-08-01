"use client";

import { useRouter } from "next/navigation";

export default function CancelBtn() {
  const router = useRouter();

  const onClickCancel = (e) => {
    e.preventDefault();
    router.back();
  };

  return (
    <button
      className="scheduleControlBtn underline underline-offset-8 hover:bg-slate-300 p-3"
      onClick={(e) => onClickCancel(e)}
    >
      C A N C E L
    </button>
  );
}
