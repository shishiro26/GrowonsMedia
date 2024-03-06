import { getTotalMoney } from "@/data/money";
import React from "react";

const TotalMoney = async () => {
  const money = await getTotalMoney();
  return <span className="font-semibold">{money}</span>;
};

export default TotalMoney;
