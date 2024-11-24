import Link from "next/link";

export default function InvalidUser() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-[80vh] w-full">
      <h1 className="text-3xl font-bold text-red-700">
        You are not authorised to open the studio of this user
      </h1>
      <Link href="/home" className="bg-white text-black p-2 rounded-full">
        Go to Home
      </Link>
    </div>
  );
}
