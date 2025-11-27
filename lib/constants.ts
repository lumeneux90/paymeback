import { DebtStatus } from "./enums";

export const colorLine = {
  [DebtStatus.PENDING]: "bg-warning",
  [DebtStatus.PAID]: "bg-success",
  [DebtStatus.WAITING]: "bg-neutral",
};
