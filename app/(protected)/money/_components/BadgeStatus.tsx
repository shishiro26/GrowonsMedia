import React from "react";
import { Badge } from "@/components/ui/badge";

const BadgeStatus = ({ status }: { status: string }) => {
  return (
    <>
      {status === "PENDING" ? (
        <Badge variant={"secondary"}>{status}</Badge>
      ) : status === "SUCCESS" ? (
        <Badge className="bg-green-500 hover:bg-green-500/75">{status}</Badge>
      ) : (
        <Badge variant={"destructive"}>{status}</Badge>
      )}
    </>
  );
};

export default BadgeStatus;
