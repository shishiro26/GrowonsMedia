import { formatPrice } from "@/components/shared/formatPrice";
import { getTotalMoney } from "@/data/money";
import React from "react";

const BalanceCell = async ({ id }: { id: string }) => {
  const remainingBalance = await getTotalMoney(id);
  return formatPrice(remainingBalance);
};

export default BalanceCell;
