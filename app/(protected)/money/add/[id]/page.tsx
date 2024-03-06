import React from "react";
import Image from "next/image";
import AddMoneyForm from "../../_components/add-money";
import NewsNotices from "@/app/(protected)/_components/News-notices";

export const generateMetadata = () => {
  return {
    title: "Add Money | GrowonsMedia",
    description: "Add money to your account",
  };
};

const page = ({ params }: { params: { id: string } }) => {
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
          <AddMoneyForm userId={params.id.toString()} />
        </div>
        <div className="md:w-[50%]">
          <NewsNotices />
        </div>
      </div>
    </section>
  );
};

export default page;
