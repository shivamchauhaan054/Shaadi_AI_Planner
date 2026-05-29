import { Wallet } from "lucide-react";

import { InlineEmpty } from "@/components/shared/inline-empty";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDisplayDate } from "@/lib/format/dates";
import { formatInr } from "@/lib/format/currency";
import type { PaymentRecord } from "@/lib/validations/payments";

type PaymentTableProps = {
  payments: PaymentRecord[];
  isLoading?: boolean;
  onAddPayment?: () => void;
};

export function PaymentTable({ payments, isLoading, onAddPayment }: PaymentTableProps) {
  if (!isLoading && payments.length === 0) {
    return (
      <InlineEmpty
        icon={Wallet}
        title="No payments logged yet"
        description="Start tracking wedding expenses by recording your first vendor payment."
        bullets={[
          "Monitor category spending",
          "Stay within your wedding budget",
          "Track balances in real time",
        ]}
        action={
          onAddPayment
            ? { label: "Add your first payment", onClick: onAddPayment }
            : undefined
        }
      />
    );
  }

  return (
    <div
      className="overflow-hidden rounded-2xl border border-border/80 bg-card/90 shadow-soft transition-opacity duration-200"
      aria-busy={isLoading}
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead scope="col">Date</TableHead>
              <TableHead scope="col">Vendor</TableHead>
              <TableHead scope="col">Category</TableHead>
              <TableHead scope="col" className="text-right">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={4} className="py-4">
                      <Skeleton className="h-9 w-full rounded-lg" />
                    </TableCell>
                  </TableRow>
                ))
              : payments.map((payment) => (
                  <TableRow
                    key={payment.id}
                    className="transition-colors duration-150 hover:bg-secondary/40"
                  >
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      <time dateTime={payment.payment_date}>
                        {formatDisplayDate(payment.payment_date, "dd MMM yyyy")}
                      </time>
                    </TableCell>
                    <TableCell className="max-w-[140px] truncate font-medium sm:max-w-none">
                      {payment.vendor_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {payment.vendor_category}
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {formatInr(payment.amount_paid)}
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
