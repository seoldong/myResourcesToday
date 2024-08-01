"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

//-------------------------------------------

export default function NavBtnNonLogin({ cookie, session, sessionValue }) {
  const path = usePathname();

  return (
    <div className="underline-offset-8 underline">
      {path === "/" ? (
        <Link className="p-3 hover:text-gray-400" href={"/login"}>
          L O G I N
        </Link>
      ) : (
        <Link className="p-3 hover:text-gray-400" href={"/"}>
          H O M E
        </Link>
      )}
    </div>
  );
}
