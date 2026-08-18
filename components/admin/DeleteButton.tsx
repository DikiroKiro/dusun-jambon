"use client";

import { useTransition } from "react";
import { btnBahaya } from "./FormControls";

type Props = {
  action: (formData: FormData) => void | Promise<void>;
  pesan?: string;
  children?: React.ReactNode;
  className?: string;
};

export function DeleteButton({
  action,
  pesan = "Yakin ingin menghapus? Tindakan ini tidak bisa dibatalkan.",
  children = "Hapus",
  className,
}: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(fd) =>
        startTransition(async () => {
          await action(fd);
        })
      }
      onSubmit={(e) => {
        if (!window.confirm(pesan)) e.preventDefault();
      }}
      className={className}
    >
      <button type="submit" disabled={pending} className={btnBahaya}>
        {pending ? "Menghapus…" : children}
      </button>
    </form>
  );
}
