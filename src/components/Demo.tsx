import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type DemoProps = {
  image: string;
  title: string;
  type?: "boxed" | "plain";
  children?: ReactNode;
};

export function Demo({ image, title, type = "plain", children }: DemoProps) {
  return (
    <figure
      className={cn(
        "w-full",
        type === "boxed" && "border rounded bg-muted p-2",
      )}
    >
      <img
        src={image}
        alt={title}
        className={cn("w-full", type === "boxed" ? "rounded" : "rounded-md")}
      />
      <figcaption className="mt-2 text-sm text-pretty">
        {title}
        {children}
      </figcaption>
    </figure>
  );
}
