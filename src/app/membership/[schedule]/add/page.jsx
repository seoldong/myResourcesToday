import CancelBtn from "@/components/CancelBtn";
import TimeInput from "@/components/TimeInput";
import addSchedule from "@/serverActions/addSchedule";

export default function MembershipScheduleAddPage() {
  return (
    <form
      className="h-full pt-5 w-4/5 flex flex-col justify-center items-center"
      action={addSchedule}
    >
      <ul className="h-4/5 flex flex-col items-center pb-3">
        <div className="h-1/5 flex flex-col justify-between items-center">
          <label className='px-2' htmlFor="title">
            T I T L E
          </label>
          <input className="text-center" type="text" name="title" id="title" />
        </div>
        <TimeInput />
        <div className="h-2/5 w-full flex flex-col justify-between items-center">
          <label className="mb-3 px-2" htmlFor="memo">
            M E M O
          </label>
          <textarea
            className="h-full w-full"
            type="text"
            name="memo"
            id="memo"
          />
        </div>
      </ul>
      <div className="h-1/5 w-full flex items-center">
        <div className="w-1/2 flex justify-center items-center">
          <button className="scheduleControlBtn underline underline-offset-8 hover:bg-gray-300 p-3 flex justify-center items-center">
            S A V E
          </button>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <CancelBtn />
        </div>
      </div>
    </form>
  );
}
