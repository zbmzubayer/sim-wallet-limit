"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";

export function InputPassword(props: React.ComponentProps<typeof Input>) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <div className="relative">
      <Input
        type={isVisible ? "text" : "password"}
        {...props}
        className="pe-10"
      />
      <button
        aria-controls="password"
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
        className="absolute inset-y-0 end-0 flex h-full w-9 cursor-pointer items-center justify-center rounded-e-md text-muted-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        onClick={toggleVisibility}
        type="button"
      >
        {isVisible ? (
          <EyeOffIcon aria-hidden="true" size={16} />
        ) : (
          <EyeIcon aria-hidden="true" size={16} />
        )}
      </button>
    </div>
  );
}
