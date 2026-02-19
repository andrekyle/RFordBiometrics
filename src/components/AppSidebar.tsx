import { LayoutDashboard, MapPin, AlertTriangle, Users, LogOut, Camera, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { logoutUser } from "@/lib/firebase";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, strokeWidth: 1.5 },
  { title: "Live Map", url: "/map", icon: MapPin, strokeWidth: 1.5 },
  { title: "Incidents", url: "/incidents", icon: AlertTriangle, strokeWidth: 1.5 },
  { title: "Drivers", url: "/drivers", icon: Users, strokeWidth: 1.5 },
  { title: "Face Recognition", url: "/face-recognition", icon: Camera, strokeWidth: 1 },
  { title: "About", url: "/about", icon: BookOpen, strokeWidth: 1.5 },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const { setOpenMobile, isMobile } = useSidebar();

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleSignOut = async () => {
    if (isMobile) {
      setOpenMobile(false);
    }
    try {
      // Sign out from Firebase (if user used Google sign-in)
      await logoutUser();
    } catch (error) {
      console.error("Sign out error:", error);
    }
    
    // Clear any auth data from localStorage
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userPhoto');
    
    // Navigate to login page
    navigate('/login');
  };

  return (
    <Sidebar className="border-r border-border bg-background">
      <div className="p-4 sm:p-6 flex items-start gap-2 sm:gap-3 border-b border-border">
        <img src="/biologo.png" alt="BioSentinel" className="h-10 w-10 sm:h-12 sm:w-12 object-contain shrink-0" />
        <div className="min-w-0">
          <h1 className="text-[16px] sm:text-base font-medium text-foreground">BioSentinel</h1>
          <p className="text-[17px] sm:text-xs text-muted-foreground">Security Platform</p>
        </div>
      </div>

      <SidebarContent className="px-3 sm:px-4 py-4 sm:py-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[17px] sm:text-xs font-medium text-muted-foreground px-2 sm:px-3 mb-2 sm:mb-3 uppercase tracking-wider">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 sm:space-y-2">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      onClick={handleNavClick}
                      className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-[14px] sm:text-sm font-normal text-sidebar-foreground hover:bg-sidebar-accent transition-all"
                      activeClassName="bg-primary text-white shadow-lg"
                    >
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={item.strokeWidth} />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 sm:p-4 border-t border-border mt-auto">
        <button 
          onClick={handleSignOut}
          className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 w-full rounded-2xl text-[14px] sm:text-sm font-normal text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
        >
          <LogOut className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
          <span>Sign Out</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
