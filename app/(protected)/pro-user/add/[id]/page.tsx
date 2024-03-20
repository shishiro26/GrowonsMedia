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
import { db } from "@/lib/db";
import { formatPrice } from "@/components/shared/formatPrice";
import RechargeProWallet from "./_components/recharge-pro-wallet";

export const generateMetadata = () => {
  return {
    title: "Add Money | GrowonsMedia",
    description: "Add money to your account",
  };
};

const page = async ({ params }: { params: { id: string } }) => {
  const proUser = await db.proUser.findUnique({
    where: { userId: params.id },
  });
  return (
    <section className="mt-4 mx-2">
      <h1 className="text-3xl">Add Money</h1>
      <div className="flex flex-col-reverse md:flex-row">
        <div className="md:w-[50%]">
          <div className="mt-2">
            <p>Scan the QR below:</p>
            <Image
              src={"/svgs/qrcode.webp"}
              alt="QR-CODE"
              width={150}
              height={150}
            />
          </div>
          <DownloadButton imageLink={"/svgs/qrcode.webp"} />
          <RechargeProWallet userId={params.id.toString()} />
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
  );
};

export default page;
