import { Ghost } from "lucide-react";

export default function VideoNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <Ghost className="h-72 w-72" />
      <h1 className="text-5xl mt-4 font-semibold">Video Not Found</h1>
    </div>
  );
}
