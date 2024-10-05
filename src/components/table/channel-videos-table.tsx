"use client";

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
import { Trash2 } from "lucide-react";
import Dialog from "@/components/dialog/dialog";
import { useToast } from "@/components/ui/use-toast";

export type Video = {
  thumbnail: string;
  isPublished: boolean;
  status: "uploading" | "transcoding" | "completed";
  likes: number;
  dislikes: number;
  views: number;
  uploadedAt: Date;
};

export const columns: ColumnDef<Video>[] = [
  {
    accessorKey: "thumbnail",
    header: "Thumbnail",
    cell: ({ row }) => {
      const { toast } = useToast();
      async function deleteVideoHandler() {
        toast({
          title: "Video Deleted Successfully",
        });
      }
      return (
        <div className="flex gap-5 items-center">
          <img
            src={row.original.thumbnail}
            alt="Thumbnail"
            className="w-24 h-16 object-cover rounded"
          />
          <UpdateVideoDetails />
          <Dialog
            AlertIcon={Trash2}
            title="Do you really want to delete video ?"
            action="Delete"
            actionHandler={deleteVideoHandler}
            actionStyle="bg-rose-600 hover:bg-rose-400"
          />
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
    accessorKey: "uploadedAt",
    header: "Date",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as Date);
      // Use a consistent locale and options for date formatting
      const formattedDate = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return formattedDate;
    },
  },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

const videos: Video[] = [
  {
    thumbnail: "https://via.placeholder.com/150x100?text=Video+1",
    isPublished: true,
    status: "completed",
    likes: 120,
    dislikes: 10,
    views: 5000,
    uploadedAt: new Date("2024-01-15T10:30:00Z"),
  },
  {
    thumbnail: "https://via.placeholder.com/150x100?text=Video+2",
    isPublished: false,
    status: "transcoding",
    likes: 0,
    dislikes: 0,
    views: 0,
    uploadedAt: new Date("2024-02-20T12:45:00Z"),
  },
  {
    thumbnail: "https://via.placeholder.com/150x100?text=Video+3",
    isPublished: true,
    status: "uploading",
    likes: 20,
    dislikes: 5,
    views: 300,
    uploadedAt: new Date("2024-03-01T08:15:00Z"),
  },
  {
    thumbnail: "https://via.placeholder.com/150x100?text=Video+4",
    isPublished: false,
    status: "transcoding",
    likes: 10,
    dislikes: 2,
    views: 150,
    uploadedAt: new Date("2024-04-10T09:20:00Z"),
  },
  {
    thumbnail: "https://via.placeholder.com/150x100?text=Video+5",
    isPublished: true,
    status: "completed",
    likes: 500,
    dislikes: 50,
    views: 12000,
    uploadedAt: new Date("2024-05-05T14:35:00Z"),
  },
  {
    thumbnail: "https://via.placeholder.com/150x100?text=Video+1",
    isPublished: true,
    status: "completed",
    likes: 120,
    dislikes: 10,
    views: 5000,
    uploadedAt: new Date("2024-01-15T10:30:00Z"),
  },
  {
    thumbnail: "https://via.placeholder.com/150x100?text=Video+2",
    isPublished: false,
    status: "transcoding",
    likes: 0,
    dislikes: 0,
    views: 0,
    uploadedAt: new Date("2024-02-20T12:45:00Z"),
  },
  {
    thumbnail: "https://via.placeholder.com/150x100?text=Video+3",
    isPublished: true,
    status: "uploading",
    likes: 20,
    dislikes: 5,
    views: 300,
    uploadedAt: new Date("2024-03-01T08:15:00Z"),
  },
  {
    thumbnail: "https://via.placeholder.com/150x100?text=Video+4",
    isPublished: false,
    status: "transcoding",
    likes: 10,
    dislikes: 2,
    views: 150,
    uploadedAt: new Date("2024-04-10T09:20:00Z"),
  },
  {
    thumbnail: "https://via.placeholder.com/150x100?text=Video+5",
    isPublished: true,
    status: "completed",
    likes: 500,
    dislikes: 50,
    views: 12000,
    uploadedAt: new Date("2024-05-05T14:35:00Z"),
  },
  {
    thumbnail: "https://via.placeholder.com/150x100?text=Video+1",
    isPublished: true,
    status: "completed",
    likes: 120,
    dislikes: 10,
    views: 5000,
    uploadedAt: new Date("2024-01-15T10:30:00Z"),
  },
  {
    thumbnail: "https://via.placeholder.com/150x100?text=Video+2",
    isPublished: false,
    status: "transcoding",
    likes: 0,
    dislikes: 0,
    views: 0,
    uploadedAt: new Date("2024-02-20T12:45:00Z"),
  },
  {
    thumbnail: "https://via.placeholder.com/150x100?text=Video+3",
    isPublished: true,
    status: "uploading",
    likes: 20,
    dislikes: 5,
    views: 300,
    uploadedAt: new Date("2024-03-01T08:15:00Z"),
  },
  {
    thumbnail: "https://via.placeholder.com/150x100?text=Video+4",
    isPublished: false,
    status: "transcoding",
    likes: 10,
    dislikes: 2,
    views: 150,
    uploadedAt: new Date("2024-04-10T09:20:00Z"),
  },
  {
    thumbnail: "https://via.placeholder.com/150x100?text=Video+5",
    isPublished: true,
    status: "completed",
    likes: 500,
    dislikes: 50,
    views: 12000,
    uploadedAt: new Date("2024-05-05T14:35:00Z"),
  },
];

export default function ChannelVideoDetailsTable() {
  const table = useReactTable({
    data: videos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-slate-100 text-black text-md font-semibold">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
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
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
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
