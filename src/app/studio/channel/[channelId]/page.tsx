import VideoUploadModal from "@/components/modals/upload-video-modal";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart, Loader2, Users, HandMetal } from "lucide-react";
import { Chart } from "@/components/charts";

export default function DashBoard() {
  return (
    <div className="flex flex-col gap-5">
      <section className="flex justify-between">
        <div>
          <h1 className="text-4xl font-semibold">Welcome Back</h1>
        </div>
        <div>
          <VideoUploadModal />
        </div>
      </section>
      <Separator />
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-start">
        <Card className="w-full bg-[#81b29a] grid grid-cols-2 gap-1 justify-items-center items-center">
          <CardHeader>
            <CardTitle className="">Total Views</CardTitle>
            <CardTitle>
              <Loader2 className="animate-spin" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-black">
            <HandMetal size={30} className="" />
          </CardContent>
        </Card>
        <Card className="w-full bg-[#bdb2ff] grid grid-cols-2 gap-1 justify-items-center items-center">
          <CardHeader>
            <CardTitle className="">Total Subscibers</CardTitle>
            <CardTitle>
              <Loader2 className="animate-spin" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-black">
            <Users size={30} />
          </CardContent>
        </Card>
        <Card className="w-full bg-[#ff5c8a] grid grid-cols-2 gap-1 justify-items-center items-center">
          <CardHeader>
            <CardTitle className="">Total Likes</CardTitle>
            <CardTitle>
              <Loader2 className="animate-spin" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-black">
            <Heart />
          </CardContent>
        </Card>
      </section>
      <section>
        <Chart />
      </section>
    </div>
  );
}
