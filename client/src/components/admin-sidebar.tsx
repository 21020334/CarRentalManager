import { Link, useLocation } from "wouter";
import { LayoutDashboard, Car, CalendarDays, ArrowLeft } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Tổng Quan",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Quản Lý Xe",
    url: "/admin/cars",
    icon: Car,
  },
  {
    title: "Đơn Thuê Xe",
    url: "/admin/bookings",
    icon: CalendarDays,
  },
];

export function AdminSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
            <Car className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold text-sm">Quản Trị</p>
            <p className="text-xs text-muted-foreground">Cho Thuê Xe</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url}
                    data-testid={`link-admin-${item.url.split("/").pop() || "dashboard"}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Link href="/">
          <Button variant="outline" className="w-full" data-testid="button-back-to-site">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Về Trang Chủ
          </Button>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
