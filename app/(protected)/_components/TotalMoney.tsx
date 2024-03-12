import { auth } from "@/auth";
import { formatPrice } from "@/components/shared/formatPrice";
import { getTotalMoney } from "@/data/money";
import React from "react";

const TotalMoney = async () => {
  const session = await auth();
  const money = await getTotalMoney(session?.user.id ?? "");
  return <span className="font-semibold">{formatPrice(money)}</span>;
};

export default TotalMoney;
