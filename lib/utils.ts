import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = "INR") {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getInitials(firstName?: string, lastName?: string) {
  if (!firstName && !lastName) return "HR";
  const f = firstName ? firstName[0] : "";
  const l = lastName ? lastName[0] : "";
  return `${f}${l}`.toUpperCase();
}

export function formatDate(dateStr: string | Date | null | undefined) {
  if (!dateStr) return "-";
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
