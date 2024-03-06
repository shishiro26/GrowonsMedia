"use client";
import { useCurrentUser } from "@/hooks/use-current-user";
import Image from "next/image";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/shared/auth/log-out-button";
import { LogOut } from "lucide-react";

const TopBar = () => {
  const user = useCurrentUser();
  return (
    <nav className="w-full flex items-center justify-end">
      <div className="flex items-center mr-2">
        <Image
          src={"/svgs/coin.svg"}
          width={5}
          height={5}
          alt="coin"
          className="w-6 h-6 m-2"
        />
        <p className="font-semibold">₹1442.47</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="link"
            className="font-semibold pointer text-lg capitalize"
          >
            {user?.name}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="m-1 w-48">
          <DropdownMenuLabel className="capitalize">
            {user?.name}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <LogoutButton>
            <DropdownMenuItem>
              <div className="cursor-pointer flex">
                <LogOut className="h-4 w-4 mr-2 cursor-pointer" />
                Logout
              </div>
            </DropdownMenuItem>
          </LogoutButton>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default TopBar;
