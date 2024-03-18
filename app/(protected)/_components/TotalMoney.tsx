import { auth } from "@/auth";
import { formatPrice } from "@/components/shared/formatPrice";
import { getUserById } from "@/data/user";
import React from "react";

const TotalMoney = async () => {
  const session = await auth();
  const user = await getUserById(session?.user.id ?? "");
  return (
    <span className="font-semibold">{formatPrice(user?.totalMoney ?? 0)}</span>
  );
};

export default TotalMoney;
