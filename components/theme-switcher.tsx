"use client";

import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const ICON_SIZE = 16;

  return (
    <DropdownMenuRadioGroup value={theme} onValueChange={(e) => setTheme(e)}>
      <DropdownMenuRadioItem className="flex gap-2" value="light">
        <Sun size={ICON_SIZE} className="text-muted-foreground" />{" "}
        <span>Light</span>
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem className="flex gap-2" value="dark">
        <Moon size={ICON_SIZE} className="text-muted-foreground" />{" "}
        <span>Dark</span>
      </DropdownMenuRadioItem>
      <DropdownMenuRadioItem className="flex gap-2" value="system">
        <Laptop size={ICON_SIZE} className="text-muted-foreground" />{" "}
        <span>System</span>
      </DropdownMenuRadioItem>
    </DropdownMenuRadioGroup>
  );
};

export { ThemeSwitcher };
