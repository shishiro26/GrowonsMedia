import React from "react";
import Image from "next/image";
import DownloadButton from "@/components/shared/download";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { getNewsById } from "@/lib/news";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TopBar from "@/app/(protected)/_components/Topbar";
import { formatPrice } from "@/components/shared/formatPrice";
import RechargeProWallet from "./_components/recharge-pro-wallet";

export const generateMetadata = () => {
  return {
    title: "Add Money | GrowonsMedia",
    description: "Add money to your account",
  };
};

const page = async ({ params }: { params: { id: string } }) => {
  const news = await getNewsById();
  const newsLength = (await getNewsById()).length;

  const user = await getUserById(params.id.toString());
  const proUser = await db.proUser.findUnique({
    where: {
      userId: params.id.toString(),
    },
  });

  const bankDetails = await db.bankDetails.findFirst({
    orderBy: {
      createdAt: "desc",
    },
    take: 1,
  });
  return (
    <>
      <div className="hidden md:block">
        <TopBar title="Add Money" />
      </div>
      <section className="mt-4 mx-2">
        <div className="flex flex-col-reverse md:flex-row">
          <div className="md:w-[50%]">
            <div className="mt-2">
              <p>Scan the QR below:</p>
              {bankDetails && (
                <Image
                  key={bankDetails.public_id}
                  src={bankDetails.secure_url ?? ""}
                  alt="QR-CODE"
                  width={150}
                  height={150}
                  className=" w-40 h-40 m-2"
                />
              )}
            </div>
            <DownloadButton imageLink={bankDetails?.secure_url ?? ""} />
            <RechargeProWallet
              userId={params.id.toString()}
              bankDetails={bankDetails}
            />
          </div>
          <div className="md:w-[50%]">
            {proUser?.isRecharged === false && (
              <>
                <Card className="m-1 md:w-full h-fit">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                      Pro wallet
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <CardDescription>
                      <span className="text-sm">
                        Pro wallet is a wallet that allows you to purchase
                        products with a negative balance
                      </span>
                    </CardDescription>
                  </CardContent>
                </Card>
                <Card className="m-1 md:w-full h-fit">
                  <CardHeader>
                    <CardTitle className="text-2xl font-semibold">
                      You have been upgraded to pro
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <CardDescription>
                      <span className="text-sm">
                        since you have upgraded to pro u haven`t recharged your
                        pro wallet balance of
                        {formatPrice(proUser?.amount ?? 0)}
                      </span>
                    </CardDescription>
                  </CardContent>
                </Card>
              </>
            )}
            <Card className="m-1 md:w-full h-fit">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  Pro wallet limit
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <CardDescription>
                  <span className="text-sm">
                    you have an purchasing limit of
                    {formatPrice(proUser?.amount ?? 0)}
                  </span>
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="m-1 md:w-full h-fit">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  Pro wallet Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <CardDescription>
                  <span className="text-sm">
                    Your current pro wallet balance is{" "}
                    {formatPrice(proUser?.amount_limit ?? 0)}
                  </span>
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
