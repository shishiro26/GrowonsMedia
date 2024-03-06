"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type CardWrapperProps = {
  children: React.ReactNode;
  headerLabel?: string;
  backButtonLabel: string;
  backButtonHref: string;
};

import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

const CardWrapper = ({
  children,
  backButtonLabel,
  backButtonHref,
  headerLabel,
}: CardWrapperProps) => {
  return (
    <Card className="m-1 shadow-md w-full lg:max-w-lg lg:p-0 sm:p-8 bg-white rounded-lg">
      <CardHeader>
        <div className="flex flex-col gap-y-2 items-center justify-center">
          <h1 className={cn("text-3xl font-semibold", font.className)}>
            GrowonsMedia
          </h1>
          <p className="text-muted-foreground text-sm">{headerLabel}</p>
        </div>{" "}
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <Button variant="link" className="font-normal w-full" size="sm" asChild>
          <Link href={backButtonHref}>{backButtonLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
