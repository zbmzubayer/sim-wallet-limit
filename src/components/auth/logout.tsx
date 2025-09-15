import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function Logout() {
  return (
    <Button
      variant="outline"
      className="text-destructive hover:text-destructive"
      onClick={async () => await signOut({ callbackUrl: "/" })}
    >
      <LogOutIcon />
      Logout
    </Button>
  );
}
