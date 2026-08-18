import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  tone?: "hijau" | "emas" | "neutral";
  className?: string;
};

const TONES = {
  hijau: "bg-hijau-100 text-hijau-900",
  emas: "bg-emas-100 text-emas-800",
  neutral: "bg-stone-100 text-stone-600",
};

export function Badge({ children, tone = "hijau", className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
