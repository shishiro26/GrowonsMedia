import { formatPrice } from "@/components/shared/formatPrice";
import { getTotalMoney } from "@/data/money";

const BalanceCell = async ({ id }: { id: string }) => {
  const remainingBalance = await getTotalMoney(id);
  return formatPrice(remainingBalance);
};

export default BalanceCell;
