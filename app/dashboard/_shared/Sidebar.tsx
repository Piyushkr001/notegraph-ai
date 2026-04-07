"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, Activity, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const dashboardNav = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Notes", href: "/dashboard/notes", icon: FileText },
  { name: "Activity", href: "/dashboard/activity", icon: Activity },
  { name: "Profile", href: "/dashboard/profile", icon: User },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" className="mt-16 h-[calc(100svh-4rem)] bg-white/60 dark:bg-gray-950/60 backdrop-blur-2xl transition-colors">
      <SidebarHeader className="border-b border-indigo-100/50 dark:border-indigo-900/40 px-4 py-4 flex items-center justify-start gap-2">
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardNav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      isActive={isActive} 
                      tooltip={item.name}
                      className={`transition-all duration-200 ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-semibold shadow-sm' : 'hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 dark:hover:text-indigo-400'}`}
                      render={(
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      )}
                    />
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
