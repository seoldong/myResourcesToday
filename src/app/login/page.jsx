import Link from "next/link";
//
export default function LogInPage() {
  //
  return (
    <div className="h-4/5 w-4/5">
      <ul className="h-full w-full flex flex-col justify-around items-center">
        <li>
          <Link
            className="p-3 hover:text-gray-400 underline-offset-8 underline"
            href={"/login/email-login"}
          >
            E - M A I L / P A S S W O R D
          </Link>
        </li>
        <li>
          <div className="p-3">G O O G L E</div>
        </li>
        <li>
          <div className="p-3">F A C E B O O K</div>
        </li>
        <li>
          <div className="p-3">G I T H U B</div>
        </li>
      </ul>
    </div>
  );
}
