import React from "react";
import Image from "next/image";
import AddMoneyForm from "../../_components/add-money";
import DownloadButton from "@/components/shared/download";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getNewsById } from "@/lib/news";

export const generateMetadata = () => {
  return {
    title: "Add Money | GrowonsMedia",
    description: "Add money to your account",
  };
};

const page = async ({ params }: { params: { id: string } }) => {
  const news = await getNewsById();
  const newsLength = (await getNewsById()).length;

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
          <AddMoneyForm userId={params.id.toString()} />
        </div>
        <div className="md:w-[50%]">
          {newsLength === 0 ? (
            <div className="m-2 font-serif">No News to show here</div>
          ) : (
            <>
              <div className="border-2 mt-4 mx-2 md:mt-10 border-black  p-2 rounded-lg">
                <span className="m-2">News and Notices</span>
                <div className="grid grid-rows-1 md:grid-rows-3">
                  {news?.map((n) => {
                    return (
                      <Card key={n.id} className="m-2 md:w-full h-fit">
                        <CardHeader>
                          <CardTitle className="text-2xl font-semibold">
                            {n.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm">
                          {n.content}
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
  );
};

export default page;
