import { checkLoginStatus } from "@/logic-s/loginStat";
import NavBtnNonLogin from "@/components/NavBtnNonLogin";
import NavLoginLeftMenu from "@/components/NavLoginLeftMenu";
import NavLoginRightMenu from "./NavLoginRightMenu";
import { customInitApp } from "@/lib/firebase-admin-config";
//
export default async function NavMenu() {

  const logStatus = await checkLoginStatus();

  return (
    <nav className="h-[10%] max-w-[40rem] shadow-md bg-gray-200 flex justify-around items-center m-auto relative">
      {logStatus.isLogged ? (
        <div className="h-full w-full flex justify-between items-center">
          <NavLoginLeftMenu />
          <NavLoginRightMenu />
        </div>
      ) : (
        <NavBtnNonLogin />
      )}
    </nav>
  );
}
