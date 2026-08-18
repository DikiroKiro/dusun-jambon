import { cn } from "@/lib/utils";

export const inputBase =
  "w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-400 focus:border-hijau-500 focus:outline-none focus:ring-2 focus:ring-hijau-100 disabled:bg-stone-100 disabled:text-stone-500";

export const btnPrimer =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-hijau-800 px-5 py-2.5 text-sm font-semibold text-krem-50 transition-colors hover:bg-hijau-900 disabled:cursor-not-allowed disabled:opacity-60";

export const btnNetral =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50";

export const btnBahaya =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60";

type LabelProps = {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
};

function Label({ label, hint, children, className }: LabelProps) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-stone-700">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-stone-400">{hint}</span>}
    </label>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
};

export function Input({ label, hint, className, ...rest }: InputProps) {
  return (
    <Label label={label} hint={hint}>
      <input className={cn(inputBase, className)} {...rest} />
    </Label>
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
};

export function Textarea({ label, hint, className, ...rest }: TextareaProps) {
  return (
    <Label label={label} hint={hint}>
      <textarea className={cn(inputBase, "leading-relaxed", className)} {...rest} />
    </Label>
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  children: React.ReactNode;
};

export function Select({ label, hint, className, children, ...rest }: SelectProps) {
  return (
    <Label label={label} hint={hint}>
      <select className={cn(inputBase, className)} {...rest}>
        {children}
      </select>
    </Label>
  );
}

export function ErrorNote({ pesan }: { pesan?: string | null }) {
  if (!pesan) return null;
  return (
    <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700 ring-1 ring-red-200">
      {pesan}
    </p>
  );
}
