import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import DownloadButton from "./download";

const ImageDialog = ({ imageLink }: { imageLink: string }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Image
          src={imageLink}
          alt="INVOICE001"
          className="cursor-pointer"
          width={50}
          height={50}
          priority
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">Invoice Image:</DialogTitle>
          <DialogDescription className="flex flex-col items-center gap-1">
            <Image
              src={imageLink}
              alt="INVOICE001"
              className="cursor-pointer"
              width={500}
              height={500}
              objectFit="cover"
              priority
            />
            <DownloadButton imageLink={imageLink} />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ImageDialog;
