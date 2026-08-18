import { cn } from "@/lib/utils";

export function StatusBadge({
  status,
  label,
}: {
  status: "DRAFT" | "PUBLISHED" | string;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        status === "PUBLISHED"
          ? "bg-green-100 text-green-700"
          : "bg-amber-100 text-amber-700"
      )}
    >
      {label ?? (status === "PUBLISHED" ? "Terbit" : "Draft")}
    </span>
  );
}
