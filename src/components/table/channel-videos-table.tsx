"use client";

import { useEffect, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import UpdateVideoDetails from "../modals/update-video-details";
import { Loader2, Trash2 } from "lucide-react";
import Dialog from "@/components/dialog/dialog";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import ApiError from "@/utils/ApiError";

export type Video = {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  isPublished: boolean;
  status: "uploading" | "transcoding" | "completed";
  likes: number;
  dislikes: number;
  views: number;
  updatedAt: Date;
};

export const columns = (
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>,
  setReloadVideos: React.Dispatch<React.SetStateAction<Boolean>>
): ColumnDef<Video>[] => [
  {
    accessorKey: "thumbnail",
    header: "Thumbnail",
    cell: ({ row }) => {
      const videoId = row.original._id;

      const { toast } = useToast();

      async function deleteVideoHandler() {
        try {
          await axios.delete(`/api/v1/video/${videoId}`);
          toast({
            title: "Video Deleted Successfully",
          });
          setVideos((prevVideos) =>
            prevVideos.filter((video) => video._id !== videoId)
          );
        } catch (error: any) {
          const axiosError = error as AxiosError<ApiError>;
          const errorMessage =
            axiosError?.response?.data?.message ?? "Error while signing up";
          toast({
            variant: "destructive",
            title: "Error while deleting the video",
            description: errorMessage,
          });
        }
      }

      return (
        <div className="flex gap-5 items-center">
          <img
            src={row.original.thumbnail}
            alt="Thumbnail"
            className="w-24 h-16 object-cover rounded"
          />
          <div>
            <p>{row.original.title}</p>
            <div className="flex items-center">
              <UpdateVideoDetails
                videoId={row.original._id}
                description={row.original.description}
                isPublished={row.original.isPublished}
                thumbnail={row.original.thumbnail}
                title={row.original.title}
                setReloadVideos={setReloadVideos}
              />
              <Dialog
                AlertIcon={Trash2}
                title="Do you really want to delete video ?"
                action="Delete"
                actionHandler={deleteVideoHandler}
                actionStyle="bg-rose-600 hover:bg-rose-400"
              />
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "isPublished",
    header: "Visibility",
    cell: ({ getValue }) => {
      const visibility = getValue() as boolean;
      let statusClass = visibility ? "text-green-500" : "text-red-500";
      let displayText = visibility ? "Published" : "Unpublished";

      return <span className={statusClass}>{displayText}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as Video["status"];
      let statusClass = "";

      switch (status) {
        case "uploading":
          statusClass = "text-yellow-500";
          break;
        case "transcoding":
          statusClass = "text-blue-500";
          break;
        case "completed":
          statusClass = "text-green-500";
          break;
      }

      return <span className={statusClass}>{status}</span>;
    },
  },
  {
    accessorKey: "likes",
    header: "Likes",
  },
  {
    accessorKey: "dislikes",
    header: "Dislikes",
  },
  {
    accessorKey: "views",
    header: "Views",
  },
  {
    accessorKey: "updatedAt",
    header: "Date",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as Date);
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return formattedDate;
    },
  },
];

export default function ChannelVideoDetailsTable({
  channelId,
}: {
  channelId: string;
}) {
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [videos, setVideos] = useState<Array<Video>>([]);
  const [reloadVideos, setReloadVideos] = useState<Boolean>(false);

  const table = useReactTable({
    data: videos,
    columns: columns(setVideos, setReloadVideos),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  async function getChannelVideos() {
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/v1/video/channel/${channelId}`);
      setVideos(response.data.data.videos);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getChannelVideos();
  }, [channelId, reloadVideos]); // Depend on channelId

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-slate-100 text-black text-md font-semibold">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="hover:bg-slate-900"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                {isLoading ? (
                  <Loader2 className="animate-spin w-16 h-16 mx-auto" />
                ) : (
                  "No Videos"
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 p-4 w-full border-t-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="text-black"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="text-black"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
