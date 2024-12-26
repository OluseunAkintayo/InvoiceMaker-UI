import React from "react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Send, CheckCircle, LogOut, Trash, BarChart2, FileText, User, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const menuItems = [
  { title: "Overview", icon: BarChart2, path: "/dashboard" },
  { title: "Invoices", icon: Send, path: "/dashboard/invoices" },
  { title: "Sent Invoices", icon: CheckCircle, path: "/dashboard/sent-invoices" },
  { title: "Deleted Items", icon: Trash, path: "/dashboard/deleted-invoices" }
];

const token = sessionStorage.getItem('token');

export function DashboardSidebar() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const logout = async () => {
    setLoading(true);
    const options: AxiosRequestConfig = {
      url: "auth/logout",
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    try {
      await axios.request(options);
      sessionStorage.removeItem("user_id");
      sessionStorage.removeItem("email");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("url");
      setTimeout(() => window.location.replace("/auth/login"), 2000);
    } catch (error) {
      const err = error as AxiosError;
      console.log(err);
      window.location.replace("/auth/login");
    }
  }
  return (
    <Sidebar className="border-r border-slate-300">
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="h-12 border-b border-slate-300 rounded-none m-0 p-0">
            <div className="flex items-center justify-center">
              <FileText className="h-6 w-6" />
              <span className="ml-2 text-xl font-bold">InvoiceMaker</span>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent className="py-2">
            <SidebarMenu>
              {menuItems.map((item) => (
                <Link to={item.path} key={item.title}>
                  <SidebarMenuItem className="">
                    <SidebarMenuButton>
                      <item.icon className="w-4 h-4 mr-2" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </Link>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroupContent className="py-2">
            <SidebarMenu>
              <Link to="/dashboard/profile">
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <User className="w-4 h-4 mr-2" />
                    <span>Profile</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </Link>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-white border-t border-slate-300">
        <div className="flex items-center gap-2 mb-2 pt-2">
          <Avatar>
            <AvatarImage src="https://github.com/jkshadcn.png" alt="profile" />
            <AvatarFallback className="bg-red-200">O</AvatarFallback>
          </Avatar>
          <span className="select-none">{sessionStorage.getItem("username")}</span>
        </div>
        <Button onClick={logout} disabled={loading}>
          {loading ? <Loader className="animate-spin" /> : <><LogOut /><span>Logout</span></>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
