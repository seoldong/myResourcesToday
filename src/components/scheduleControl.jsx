"use client";
import { deleteSchedule } from "@/logic-c/apiRoute";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function ScheduleControl() {
  const router = useRouter();
  const params = useParams();
  const scheduleName = params.schedule;
  //
  const onClickDelete = async (e) => {
    e.preventDefault();
    const deleteResulte = await deleteSchedule(scheduleName);
    router.push("/membership/schedule");
    router.refresh();
  };
  //
  return (
    <>
      {scheduleName !== "schedule" ? (
        <ul className="h-1/5 w-full flex items-center">
          <div className="w-1/3 flex justify-center items-center">
            <button
              className="scheduleControlBtn underline underline-offset-8 p-3 hover:text-gray-400"
              onClick={() => router.push(`/membership/schedule/add`)}
            >
              A D D
            </button>
          </div>
          <div className="w-1/3 flex justify-center items-center">
            <button
              className="scheduleControlBtn underline underline-offset-8 p-3 hover:text-gray-400"
              onClick={() =>
                router.push(
                  `/membership/schedule/edit?editTarget=${scheduleName}`
                )
              }
            >
              E D I T
            </button>
          </div>
          <div className="w-1/3 flex justify-center items-center">
            <button
              className="scheduleControlBtn underline underline-offset-8 p-3 hover:text-gray-400"
              onClick={(e) => onClickDelete(e)}
            >
              D E L E T E
            </button>
          </div>
        </ul>
      ) : (
        <></>
      )}
    </>
  );
}
