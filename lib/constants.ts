import { DebtStatus } from "./enums";

export const colorLine = {
  [DebtStatus.PENDING]: "bg-warning",
  [DebtStatus.PAID]: "bg-success",
  [DebtStatus.HIDDEN]: "bg-neutral",
};
