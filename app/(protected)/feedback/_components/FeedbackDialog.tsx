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
};

const FeedbackDialog = ({ fileName, secure_url, public_id }: FeedbackProps) => {
  return (
    <Dialog>
      <DialogTrigger>Download</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">Files:</DialogTitle>

          <div className="flex flex-row items-center">
            <p className="capitalize font-bold">{fileName}</p>
            <FileDownload secure_url={secure_url} fileName={fileName} />
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
