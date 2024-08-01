import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div>404 not found</div>
      <div>
        <Link href={"/"}>home</Link>
      </div>
    </div>
  );
}
