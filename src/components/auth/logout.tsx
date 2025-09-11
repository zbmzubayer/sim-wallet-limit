import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function Logout() {
  return (
    <Button variant="destructive" onClick={async () => await signOut()}>
      <LogOutIcon />
      Logout
    </Button>
  );
}
