"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "left" | "right";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: Direction;
};

const hiddenByDirection: Record<Direction, string> = {
  up: "translate-y-6 motion-reduce:translate-y-0",
  left: "-translate-x-10 motion-reduce:translate-x-0",
  right: "translate-x-10 motion-reduce:translate-x-0",
};

export function Reveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      const id = setTimeout(() => setVisible(true), 0);
      return () => clearTimeout(id);
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -48px 0px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none",
        visible
          ? "translate-x-0 translate-y-0 opacity-100"
          : cn(hiddenByDirection[direction], "opacity-0 motion-reduce:opacity-100"),
        className
      )}
    >
      {children}
    </div>
  );
}
