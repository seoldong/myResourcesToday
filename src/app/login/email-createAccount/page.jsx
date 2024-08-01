import createUser from "@/serverActions/createUser";
import Link from "next/link";

export default function LoginEmailCreateAccountPage() {
  return (
    <form className="h-4/5 w-4/5" action={createUser}>
      <ul className="h-4/5 w-full flex flex-col items-center">
        <li className="flex flex-col justify-center items-center">
          <label className="mb-4" htmlFor="email">
            <span className="">E - M A I L</span>
          </label>
          <input
            className="text-center"
            name="email"
            id="email"
            type="email"
            autoComplete="off"
          />
        </li>
        <li className="flex flex-col justify-center items-center mt-[5rem]">
          <label className="mb-4" htmlFor="password">
            <span className="">P A S S W O R D</span>
          </label>
          <input
            className="text-center"
            name="password"
            id="password"
            type="password"
            autoComplete="off"
          />
        </li>
        <li className="flex flex-col justify-center items-center mt-[5rem]">
          <label className="mb-4" htmlFor="reconfirm">
            <span className="">P A S S W O R D _ R E C O N F I R M</span>
          </label>
          <input
            className="text-center"
            name="reconfirm"
            id="reconfirm"
            type="password"
            autoComplete="off"
          />
        </li>
      </ul>

      <ul className="h-1/5 flex justify-around items-center">
        <li>
          <button className="underline underline-offset-8 hover:text-gray-400">
            C R E A T E _ A C C O U N T
          </button>
        </li>
        <li>
          <Link
            className="underline underline-offset-8 hover:text-gray-400"
            href={"/login/email-login"}
          >
            <span>P R E V</span>
          </Link>
        </li>
      </ul>
    </form>
  );
}
