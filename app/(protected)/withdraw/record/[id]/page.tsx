import { Button } from "@/components/ui/button";
import React from "react";
import Image from "next/image";
import { WithdrawalTable } from "../../_components/request-table";
import Link from "next/link";
import { auth } from "@/auth";
import TopBar from "@/app/(protected)/_components/Topbar";

export const generateMetadata = () => {
  return {
    title: "Withdraw Wallet | GrowonsMedia",
    description: "Withdrawal Records",
  };
};

type RecordProps = {
  params: { id: string };
  searchParams: { page: string };
};

const page = async ({ params, searchParams }: RecordProps) => {
  const session = await auth();

  return (
    <>
      <div className="hidden md:block">
        <TopBar title="Withdraw Records" />
      </div>
      <section className="space-y-4 md:max-h-[90vh] w-full md:w-[100%] p-2">
        <div className="flex items-center gap-x-2">
          <Button className="flex items-center" asChild>
            <Link
              href={`/withdraw/request/${session?.user.id}`}
              className="inline"
            >
              <Image
                src="/svgs/plus.svg"
                alt="request withdrawal"
                width={20}
                height={20}
                className="h-6 w-6 mr-1"
              />
              Request Withdrawal
            </Link>
          </Button>
        </div>
        <section>
          <WithdrawalTable
            userId={params.id.toString()}
            searchParams={searchParams}
          />
        </section>
      </section>
    </>
  );
};

export default page;
