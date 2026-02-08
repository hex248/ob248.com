import type { MouseEventHandler } from "react";
import { cn } from "@/lib/utils";
import type { TravelMetadata } from "@/travel";
import { Button } from "./ui/button";

export function TravelListItem({
  metadata,
  onClick,
}: {
  metadata: TravelMetadata;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <Button
      className={cn(
        "text-sm border cursor-pointer hover:border-accent justify-start",
      )}
      onClick={onClick}
      variant="dummy"
      size="sm"
    >
      {metadata.city}, {metadata.country} - {metadata.date}
    </Button>
  );
}
