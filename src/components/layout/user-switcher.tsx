"use client";

import { useAuth } from "@/context/auth-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users } from "lucide-react";

export function UserSwitcher() {
  const { user, users, switchUser } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-2 max-w-xs">
        <Users className="h-5 w-5 text-muted-foreground" />
      <Select value={user.id} onValueChange={switchUser}>
        <SelectTrigger className="w-[220px] bg-transparent border-0 shadow-none focus:ring-0">
          <SelectValue placeholder="Switch User" />
        </SelectTrigger>
        <SelectContent>
          {users.map((u) => (
            <SelectItem key={u.id} value={u.id}>
              {u.name} ({u.role})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
