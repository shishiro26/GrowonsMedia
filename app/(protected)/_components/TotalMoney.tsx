import { auth } from "@/auth";
import { formatPrice } from "@/components/shared/formatPrice";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import React from "react";

const TotalMoney = async () => {
  const session = await auth();
  const user = await getUserById(session?.user.id ?? "");
  const proUser = await db.proUser.findUnique({
    where: {
      userId: user?.id,
    },
  });
  return (
    <>
      {user?.role === "PRO" ? (
        <span className="font-semibold">
          {formatPrice((proUser?.amount_limit ?? 0) + user?.totalMoney)}
        </span>
      ) : (
        <span className="font-semibold">
          {formatPrice(user?.totalMoney ?? 0)}
        </span>
      )}
    </>
  );
};

export default TotalMoney;
