import React from "react";
import Image from "next/image";
import AddMoneyForm from "../../_components/add-money";
import DownloadButton from "@/components/shared/download";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getNewsById } from "@/lib/news";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import TopBar from "@/app/(protected)/_components/Topbar";
import CopyButton from "@/components/shared/copy-button";

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
                <div className="flex flex-row items-center">
                  <Image
                    key={bankDetails.public_id}
                    src={bankDetails.secure_url ?? ""}
                    alt="QR-CODE"
                    width={150}
                    height={150}
                    className=" w-40 h-40 m-2"
                  />
                  <div className="flex flex-col">
                    <div>
                      <span className="block">UPI ID:</span>
                      <span className="font-semibold border-2 border-black p-1 rounded-lg flex items-center gap-x-2">
                        {bankDetails?.upiid}
                        <span className="hidden md:block">
                          <CopyButton text={bankDetails.upiid} />
                        </span>
                      </span>
                    </div>
                    <div>
                      <span className="block">UPI Number:</span>
                      <span className="font-semibold border-2 border-black p-1 rounded-lg flex items-center gap-x-2 justify-between">
                        {bankDetails?.upinumber}
                        <span className="hidden md:block">
                          <CopyButton text={bankDetails.upinumber} />
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <DownloadButton imageLink={bankDetails?.secure_url ?? ""} />
            <AddMoneyForm
              userId={params.id.toString()}
              bankDetails={bankDetails}
            />
          </div>
          <div className="md:w-[50%] flex flex-col-reverse md:flex-col gap-y-2">
            <div>
              <p className="font-bold font-2xl mb-2">Bank Details :</p>
              <div className="flex items-center flex-wrap">
                <span>Name:</span>
                <span className="font-semibold p-2 rounded-lg flex items-center gap-x-2">
                  {bankDetails?.name}
                  {bankDetails && (
                    <span className="hidden md:block">
                      <CopyButton text={bankDetails.name} />
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center">
                <span>IFSC Code:</span>
                <span className="font-semibold p-2 rounded-lg flex items-center gap-x-2">
                  {bankDetails?.ifsccode}
                  {bankDetails && (
                    <span className="hidden md:block">
                      <CopyButton text={bankDetails.ifsccode} />
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center">
                <span>Account type:</span>
                <span className="font-semibold p-2 rounded-lg flex items-center gap-x-2">
                  {bankDetails?.accountType}
                  {bankDetails && (
                    <span className="hidden md:block">
                      <CopyButton text={bankDetails.accountType} />
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center">
                <span>Bank Name:</span>
                <span className="font-semibold p-2 rounded-lg flex items-center gap-x-2">
                  {bankDetails?.bankName}
                  {bankDetails && (
                    <span className="hidden md:block">
                      <CopyButton text={bankDetails.bankName} />
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center">
                <span>Account Number:</span>
                <span className="font-semibold p-2 rounded-lg flex items-center gap-x-2">
                  {bankDetails?.accountDetails}
                  {bankDetails && (
                    <span className="hidden md:block">
                      <CopyButton text={bankDetails.accountDetails} />
                    </span>
                  )}
                </span>
              </div>
            </div>
            {newsLength === 0 ? (
              <div className="m-2 font-serif">No News to show here</div>
            ) : (
              <>
                <div className=" h-[45%] overflow-y-auto border-2 mt-4 mx-2 md:mt-5 border-black  p-2 rounded-lg">
                  <span className="m-2">News and Notices</span>
                  <div className="grid grid-rows-1 md:grid-rows-3 p-2">
                    {news?.map((n) => {
                      return (
                        <Card key={n.id} className="m-2 md:w-full h-fit">
                          <CardHeader>
                            <CardTitle className="text-xl font-semibold capitalize">
                              {n.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm">
                            {n.content.includes("https") ? (
                              <Link
                                href={n.content}
                                target="_blank"
                                className="text-[#3b49df] underline"
                              >
                                {n.content}
                              </Link>
                            ) : (
                              <>{n.content}</>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                    
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
