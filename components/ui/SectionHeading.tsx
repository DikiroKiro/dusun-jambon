import { cn } from "@/lib/utils";

type Props = {
  label?: string;
  title: string;
  description?: string;
  center?: boolean;
  className?: string;
};

export function SectionHeading({
  label,
  title,
  description,
  center,
  className,
}: Props) {
  return (
    <div className={cn("mb-8", center && "text-center", className)}>
      {label && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emas-600">
          {label}
        </p>
      )}
      <h2 className="text-2xl font-bold text-hijau-950 sm:text-3xl">{title}</h2>
      {description && (
        <p
          className={cn(
            "mt-3 max-w-2xl text-sm leading-relaxed text-stone-600 sm:text-base",
            center && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
