"use client"

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Receipt, BarChart3, Settings } from "lucide-react";

import { cn } from "@/lib/utils";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { useAuth } from "@/context/auth-context";

const allNavItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["Accounts Manager (Alampatti)", "Accounts Manager (Kappalur)", "Chairman"] },
  { href: "/bills", icon: Receipt, label: "Bills", roles: ["Accounts Manager (Alampatti)", "Accounts Manager (Kappalur)", "Chairman"] },
  { href: "/reports", icon: BarChart3, label: "Reports", roles: ["Chairman"] },
  { href: "/admin", icon: Settings, label: "Admin", roles: ["Chairman"] },
];

export default function MainNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = React.useMemo(() => {
    if (!user) return [];
    return allNavItems.filter(item => item.roles.includes(user.role));
  }, [user]);

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={pathname.startsWith(item.href)}
              className="justify-start w-full"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
