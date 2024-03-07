import { Button } from "@/components/ui/button";
import React from "react";
import Image from "next/image";
import { MoneyTable } from "../../_components/money-table";
import Link from "next/link";
import { auth } from "@/auth";

export const generateMetadata = () => {
  return {
    title: "Money wallet | GrowonsMedia",
    description: "Money Record",
  };
};

type RecordProps = {
  params: { id: string };
  searchParams: { page: string };
};

const page = async ({ params, searchParams }: RecordProps) => {
  const session = await auth();
  return (
    <section className="ml-2 mt-4 space-y-4">
      <Button className="flex items-center " asChild>
        <Link href={`/money/add/${session?.user.id}`} className="inline">
          <Image
            src="/svgs/plus.svg"
            alt="add money"
            width={20}
            height={20}
            className="h-6 w-6 mr-1"
          />
          Add Money here
        </Link>
      </Button>
      <div>
        <MoneyTable userId={params.id.toString()} searchParams={searchParams} />
      </div>
    </section>
  );
};

export default page;
