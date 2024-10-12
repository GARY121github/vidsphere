import Link from "next/link";

export default function InvalidUser() {
  return (
    <div className="flex flex-col items-center h-[80vh]">
      <h1 className="text-3xl font-bold text-red-700">
        You are not authorised to open the studio of this user
      </h1>
      <Link href="/home">Go to Home</Link>
    </div>
  );
}
