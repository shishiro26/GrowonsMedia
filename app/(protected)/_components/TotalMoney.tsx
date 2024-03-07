import { auth } from "@/auth";
import { getTotalMoney } from "@/data/money";
import React from "react";

const TotalMoney = async () => {
  const session = await auth();
  const money = await getTotalMoney(session?.user.id ?? "");
  return <span className="font-semibold">{money}</span>;
};

export default TotalMoney;
