"use client";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { User } from "@/models/user.model";
import { useToast } from "@/components/ui/use-toast";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ChangeAvatarForm from "@/components/forms/change-avatar-form";
import UpdateUserProfile from "@/components/forms/update-user-profile-form";
import ApiError from "@/utils/ApiError";
import ChangeCoverImageForm from "@/components/forms/change-cover-image-form";

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reloadInformation, setReloadInformation] = useState<Boolean>(false);
  const { toast } = useToast();

  async function getCurrentUserDetails() {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/v1/user/current-user");
      setUser(response.data.data);
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError?.response?.data?.message ?? "Error while signing up";
      toast({
        variant: "destructive",
        title: "Error while changing the password",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getCurrentUserDetails();
  }, [reloadInformation]);

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl font-semibold">Edit Profile</h1>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="animate-spin h-24 w-24" />
        </div>
      ) : (
        <div>
          {user && (
            <section>
              <div className="cursor-pointer relative group">
                <Dialog>
                  <DialogTrigger asChild>
                    <div>
                      <img
                        src={user.coverImage}
                        className="object-cover w-full rounded-lg transition duration-300 group-hover:opacity-50 group-hover:shadow-lg group-hover:shadow-black sm:h-32 md:h-48 lg:h-64"
                        alt="channel"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Camera className="h-10 w-10 text-white" />
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="text-white bg-[#303030] border-0 max-w-6xl">
                    <DialogHeader className="text-white">
                      <DialogTitle>Change Cover Image</DialogTitle>
                    </DialogHeader>
                    <ChangeCoverImageForm
                      setReloadInformation={setReloadInformation}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="p-4 flex flex-col sm:flex-row sm:items-start sm:space-x-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Avatar className="h-32 w-32 mx-auto sm:mx-0 sm:h-44 sm:w-44 cursor-pointer relative group">
                      <AvatarImage
                        src={user.avatar}
                        className="rounded-full object-cover transition duration-300 group-hover:opacity-50 group-hover:shadow-lg group-hover:shadow-black"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <Camera className="h-10 w-10 text-white" />
                      </div>
                    </Avatar>
                  </DialogTrigger>

                  <DialogContent className="text-white bg-[#303030] border-0 max-w-lg">
                    <DialogHeader className="text-white">
                      <DialogTitle>Change Avatar</DialogTitle>
                    </DialogHeader>
                    <ChangeAvatarForm
                      setReloadInformation={setReloadInformation}
                    />
                  </DialogContent>
                </Dialog>

                <div className="flex-1 mt-6 sm:mt-0">
                  <UpdateUserProfile
                    username={user.username}
                    email={user.email}
                    fullName={user.fullName}
                  />
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
