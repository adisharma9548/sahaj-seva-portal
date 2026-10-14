import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function maskAadhaar(last4OrFull: string): string {
  if (!last4OrFull) return "XXXX-XXXX-0000";
  const clean = last4OrFull.replace(/\D/g, "");
  if (clean.length === 4) {
    return `XXXX-XXXX-${clean}`;
  }
  if (clean.length === 12) {
    return `XXXX-XXXX-${clean.slice(-4)}`;
  }
  return `XXXX-XXXX-${clean.slice(-4) || "0000"}`;
}

export function formatDate(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "N/A";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "N/A";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "N/A";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(amount: number): string {
  if (amount === 0) return "Free (₹0)";
  return `₹${amount}`;
}
