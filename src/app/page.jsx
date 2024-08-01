import TimerNonLogin from "@/components/TimerNonLogin";
import { checkLoginStatus } from "@/logic-s/loginStat";

//------------------

export default async function RootPage() {
  const logStatus = await checkLoginStatus();

  return (
    <div className="h-4/5 w-4/5">
      <h1 className="text-4xl h-40 w-full flex justify-center items-center font-extralight">
        Time Left Until Midnight
      </h1>
      <TimerNonLogin logStatus={logStatus.isLogged} />
    </div>
  );
}
