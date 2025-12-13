import type { LoanScheduleItem, Repayment, Frequency } from "@/types";

export function calcSchedule({
  principal,
  annualRate,
  termMonths,
  frequency = "monthly",
  fees = 0,
  startDate = new Date(),
}: {
  principal: number;
  annualRate: number; // e.g. 0.18 for 18%
  termMonths: number;
  frequency?: Frequency;
  fees?: number;
  startDate?: Date;
}): LoanScheduleItem[] {
  const periods =
    frequency === "monthly"
      ? termMonths
      : frequency === "weekly"
      ? termMonths * 4
      : termMonths * 30;
  const periodRate =
    annualRate /
    (frequency === "monthly" ? 12 : frequency === "weekly" ? 52 : 365);
  const r = periodRate;
  const n = periods;
  const A = r > 0 ? (principal * r) / (1 - Math.pow(1 + r, -n)) : principal / n;
  const items: LoanScheduleItem[] = [];
  let balance = principal;
  let due = new Date(startDate);
  for (let i = 1; i <= n; i++) {
    const interest = balance * r;
    const principalPay = Math.max(0, A - interest);
    const fee = fees / n; // spread fees
    const total = interest + principalPay + fee;
    const closing = Math.max(0, balance - principalPay);
    // advance date
    if (frequency === "monthly") due.setMonth(due.getMonth() + 1);
    else if (frequency === "weekly") due.setDate(due.getDate() + 7);
    else due.setDate(due.getDate() + 1);
    items.push({
      installmentNo: i,
      dueDate: due.toISOString().slice(0, 10),
      openingBalance: round2(balance),
      interest: round2(interest),
      principal: round2(principalPay),
      fees: round2(fee),
      totalDue: round2(total),
      closingBalance: round2(closing),
      paid: false,
    });
    balance = closing;
  }
  return items;
}

export function computeArrears(
  schedule: LoanScheduleItem[],
  repayments: Repayment[],
  today = new Date()
) {
  const paidAmountsByInstallment = new Map<number, number>();
  // naive mapping: apply repayments to earliest unpaid installment
  let remaining = repayments
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((r) => r.amount);

  const result = schedule.map((s) => {
    let paid = paidAmountsByInstallment.get(s.installmentNo) || 0;
    while (remaining.length && paid < s.totalDue) {
      const amt = remaining[0];
      const needed = s.totalDue - paid;
      const apply = Math.min(amt, needed);
      paid += apply;
      remaining[0] = amt - apply;
      if (remaining[0] === 0) remaining.shift();
    }
    const overdue =
      new Date(s.dueDate).getTime() < today.getTime() && paid < s.totalDue;
    return {
      ...s,
      paidAmount: round2(paid),
      overdue,
      outstanding: round2(Math.max(0, s.totalDue - paid)),
    };
  });
  const totalOutstanding = round2(
    result.reduce((acc, r) => acc + r.outstanding, 0)
  );
  const overdueCount = result.filter((r) => r.overdue).length;
  return { items: result, totalOutstanding, overdueCount };
}

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}
