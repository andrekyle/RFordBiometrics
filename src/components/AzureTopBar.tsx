import { Menu, Search, Bell, Settings, HelpCircle, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function AzureTopBar() {
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="h-[50px] bg-primary flex items-center justify-between px-2 sm:px-4 border-b border-primary shadow-sm">
      {/* Left Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button className="text-white hover:bg-white/10 p-1.5 sm:p-2 rounded-sm transition-colors">
          <Menu className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <div className="flex items-center gap-2">
          <img src="/biologo.png" alt="BioSentinel" className="h-8 w-8 object-contain" />
          <span className="text-white font-semibold text-sm sm:text-[15px]">BioSentinel</span>
        </div>
      </div>

      {/* Center Section - Search (hidden on mobile) */}
      <div className="hidden sm:block flex-1 max-w-2xl mx-4">
        <div className={`relative transition-all ${searchFocused ? 'ring-2 ring-white/30' : ''}`}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search resources, services, and docs (G+/)"
            className="w-full h-[32px] pl-10 pr-4 bg-white rounded-sm text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </div>

      {/* Right Section - Utilities */}
      <div className="flex items-center gap-0.5 sm:gap-1">
        <button className="text-white hover:bg-white/10 p-1.5 sm:p-2 rounded-sm transition-colors">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
        </button>
        <button className="text-white hover:bg-white/10 p-1.5 sm:p-2 rounded-sm transition-colors hidden sm:inline-flex">
          <Settings className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <button className="text-white hover:bg-white/10 p-1.5 sm:p-2 rounded-sm transition-colors hidden sm:inline-flex">
          <HelpCircle className="h-5 w-5" strokeWidth={1.5} />
        </button>
        <button 
          className="text-white hover:bg-white/10 p-1.5 sm:p-2 rounded-sm transition-colors ml-1 sm:ml-2"
          onClick={() => navigate('/login')}
        >
          <User className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
