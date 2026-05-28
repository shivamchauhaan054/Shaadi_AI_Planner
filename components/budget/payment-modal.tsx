"use client";

import { useEffect } from "react";
import { useForm, type DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatTodayIsoDate } from "@/lib/format/dates";
import {
  paymentFormSchema,
  type CreatePaymentInput,
  type PaymentFormValues,
} from "@/lib/validations/payments";

const defaultFormValues = {
  vendor_category: "",
  vendor_name: "",
  payment_date: "",
} satisfies DefaultValues<PaymentFormValues>;

type PaymentModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  intakeId: string;
  vendorCategories: string[];
  onSubmit: (data: CreatePaymentInput) => Promise<void>;
  isSubmitting?: boolean;
};

export function PaymentModal({
  open,
  onOpenChange,
  intakeId,
  vendorCategories,
  onSubmit,
  isSubmitting = false,
}: PaymentModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: defaultFormValues,
  });

  const vendorCategory = watch("vendor_category");

  useEffect(() => {
    if (open) {
      reset({
        ...defaultFormValues,
        payment_date: formatTodayIsoDate(),
        vendor_category: vendorCategories[0] ?? "",
      });
    }
  }, [open, reset, vendorCategories]);

  const handleFormSubmit = handleSubmit(async (values) => {
    try {
      await onSubmit({
        intake_id: intakeId,
        vendor_category: values.vendor_category,
        vendor_name: values.vendor_name,
        amount_paid: values.amount_paid,
        payment_date: values.payment_date,
      });

      reset({
        ...defaultFormValues,
        payment_date: formatTodayIsoDate(),
      });
      onOpenChange(false);
    } catch {
      // Parent surfaces errors; keep modal open for correction.
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Record payment
          </DialogTitle>
          <DialogDescription>
            Track spend against your AI vendor allocations.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-4" noValidate>
          <input type="hidden" {...register("vendor_category")} />

          <FormField
            label="Vendor category"
            htmlFor="vendor_category"
            required
            error={errors.vendor_category?.message}
          >
            <Select
              value={vendorCategory}
              onValueChange={(value) =>
                setValue("vendor_category", value, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger id="vendor_category" className="h-11">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {vendorCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Vendor name"
            htmlFor="vendor_name"
            required
            error={errors.vendor_name?.message}
          >
            <Input
              id="vendor_name"
              placeholder="Studio name, caterer, venue…"
              className="h-11"
              autoComplete="organization"
              {...register("vendor_name")}
            />
          </FormField>

          <FormField
            label="Amount paid (INR)"
            htmlFor="amount_paid"
            required
            error={errors.amount_paid?.message}
          >
            <Input
              id="amount_paid"
              type="number"
              min={1}
              step={1000}
              inputMode="numeric"
              placeholder="50000"
              className="h-11"
              {...register("amount_paid", { valueAsNumber: true })}
            />
          </FormField>

          <FormField
            label="Payment date"
            htmlFor="payment_date"
            required
            error={errors.payment_date?.message}
          >
            <Input
              id="payment_date"
              type="date"
              className="h-11"
              {...register("payment_date")}
            />
          </FormField>

          <DialogFooter className="gap-2 pt-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Saving…
                </>
              ) : (
                "Save payment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
