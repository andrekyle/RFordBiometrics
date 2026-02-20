import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Footer from "@/components/Footer";
import { loadGoogleMaps } from "@/lib/google-maps-loader";

export default function AppLayout() {
  // Load Google Maps API when entering dashboard routes
  useEffect(() => {
    loadGoogleMaps().catch((err) =>
      console.warn('Google Maps failed to load:', err)
    );
  }, []);
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 bg-background">
          <header className="h-10 sm:h-12 flex items-center border-b border-border px-2 sm:px-4 bg-card/50 backdrop-blur-sm shrink-0">
            <SidebarTrigger className="mr-2 sm:mr-4" />
            <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary animate-pulse-glow" />
              <span className="text-[14px] sm:text-xs font-mono text-primary tracking-widest">SYSTEM ONLINE</span>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-background pb-[50px] sm:pb-0">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
