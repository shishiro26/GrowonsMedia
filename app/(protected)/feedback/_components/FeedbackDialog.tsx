"use client";
import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FileDownload from "../../admin/_components/file-download";

type FeedbackProps = {
  fileName: string;
  secure_url: string;
  public_id: string;
  head: string;
};

const FeedbackDialog = ({ secure_url, head }: FeedbackProps) => {
  return (
    <Dialog>
      <DialogTrigger>
        {head === "Reply" ? "Reply attachment" : "Feedback Attachment"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">Files:</DialogTitle>
          <div className="flex items-center justify-center">
            <video src={secure_url} controls width={150} height={150} />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
