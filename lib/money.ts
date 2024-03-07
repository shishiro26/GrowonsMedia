import { db } from "./db";

export const getMoneyByUserId = async (userId: string) => {
  return await db.money.findMany({
    where: { userId: userId },
  });
};
