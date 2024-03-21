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
                />
              )}
            </div>
            <DownloadButton imageLink={bankDetails?.secure_url ?? ""} />
            <AddMoneyForm
              userId={params.id.toString()}
              bankDetails={bankDetails}
            />
          </div>
          <div className="md:w-[50%]">
            {proUser !== null &&
              (proUser?.isRecharged === false || user?.role === "PRO") && (
                <>
                  {proUser?.amount < proUser?.amount_limit && (
                    <Button variant={"link"} asChild>
                      <Link href={`/pro-user/add/${user?.id}`}>
                        Recharge the pro wallet
                      </Link>
                    </Button>
                  )}
                </>
              )}

            {newsLength === 0 ? (
              <div className="m-2 font-serif">No News to show here</div>
            ) : (
              <>
                <div className="border-2 mt-4 mx-2 md:mt-5 border-black  p-2 rounded-lg">
                  <span className="m-2">News and Notices</span>
                  <div className="grid grid-rows-1 md:grid-rows-3">
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
