import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/cn";

export function Spinner({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn(className)} {...props}>
      <Loader2Icon className="size-4 animate-spin" />
    </div>
  );
}
