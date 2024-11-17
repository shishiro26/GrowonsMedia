import React from "react";
import RequestWithdrawalForm from "../../_components/withdraw-request";
import TopBar from "@/app/(protected)/_components/Topbar";

export const generateMetadata = () => {
  return {
    title: "Request Withdrawal | GrowonsMedia",
    description: "Request withdrawal from your account",
  };
};

const page = async ({ params }: { params: { id: string } }) => {
  return (
    <>
      <div className="hidden md:block">
        <TopBar title="Request Withdrawal" />
      </div>
      <section className="mt-4 mx-2">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-full">
            <RequestWithdrawalForm userId={params.id.toString()} />
          </div>
        </div>
      </section>
    </>
  );
};

export default page;
